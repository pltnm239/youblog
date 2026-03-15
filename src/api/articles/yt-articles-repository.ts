import type {HostAPI} from '../host';
import type {Blog, BlogPost, ArticleComment, CreatePostPayload, UpdatePostPayload, Author} from '../types';
import type {ArticlesRepository} from './articles-repository';

interface YTArticle {
  id: string;
  idReadable: string;
  summary: string;
  content: string;
  created: number;
  updated: number;
  reporter: {
    login: string;
    fullName: string;
    avatarUrl: string;
    ringId: string;
  };
  parentArticle: {
    id: string;
    idReadable: string;
    summary: string;
  } | null;
  childArticles: readonly { id: string }[];
  tags: readonly { id: string; name: string }[];
  comments: readonly YTComment[];
  hasStar: boolean;
}

interface YTComment {
  id: string;
  text: string;
  created: number;
  author: {
    login: string;
    fullName: string;
    avatarUrl: string;
    ringId: string;
  };
}

const ARTICLE_FIELDS = 'id,idReadable,summary,content,created,updated,hasStar,reporter(login,fullName,avatarUrl,ringId),parentArticle(id,idReadable,summary),childArticles(id),tags(id,name),comments(id,text,created,author(login,fullName,avatarUrl,ringId))';
const ARTICLE_LIST_FIELDS = 'id,idReadable,summary,content,created,updated,hasStar,reporter(login,fullName,avatarUrl,ringId),parentArticle(id,idReadable,summary),childArticles(id),tags(id,name),comments(id)';

function mapAuthor(reporter: YTArticle['reporter']): Author {
  return {
    login: reporter.login,
    fullName: reporter.fullName || reporter.login,
    avatarUrl: reporter.avatarUrl || '',
    ringId: reporter.ringId || '',
  };
}

function mapBlog(article: YTArticle): Blog {
  return {
    id: article.id,
    idReadable: article.idReadable,
    summary: article.summary,
    content: article.content || '',
    created: article.created,
    updated: article.updated,
    author: mapAuthor(article.reporter),
    childCount: article.childArticles?.length ?? 0,
  };
}

function mapPost(article: YTArticle): BlogPost {
  return {
    id: article.id,
    idReadable: article.idReadable,
    summary: article.summary,
    content: article.content || '',
    created: article.created,
    updated: article.updated,
    author: mapAuthor(article.reporter),
    parentArticle: article.parentArticle,
    tags: article.tags ?? [],
    commentsCount: article.comments?.length ?? 0,
    hasStar: article.hasStar ?? false,
  };
}

function mapComment(comment: YTComment): ArticleComment {
  return {
    id: comment.id,
    text: comment.text || '',
    created: comment.created,
    author: {
      login: comment.author.login,
      fullName: comment.author.fullName || comment.author.login,
      avatarUrl: comment.author.avatarUrl || '',
      ringId: comment.author.ringId || '',
    },
  };
}

export class YtArticlesRepository implements ArticlesRepository {
  private readonly host: HostAPI;

  constructor(host: HostAPI) {
    this.host = host;
  }

  async getBlogs(projectShortName: string): Promise<readonly Blog[]> {
    const articles = await this.host.fetchYouTrack<readonly YTArticle[]>(
      `articles?fields=${ARTICLE_LIST_FIELDS}&query=project:+${encodeURIComponent(`{${projectShortName}}`)}&$top=100`
    );

    return articles
      .filter(a => !a.parentArticle)
      .map(mapBlog);
  }

  async getPosts(blogArticleId: string): Promise<readonly BlogPost[]> {
    const article = await this.host.fetchYouTrack<YTArticle>(
      `articles/${blogArticleId}?fields=childArticles(${ARTICLE_LIST_FIELDS})`
    );

    if (!article.childArticles) {
      return [];
    }

    const children = article.childArticles as unknown as readonly YTArticle[];
    return children
      .map(mapPost)
      .sort((a, b) => b.created - a.created);
  }

  async getPost(articleId: string): Promise<BlogPost> {
    const article = await this.host.fetchYouTrack<YTArticle>(
      `articles/${articleId}?fields=${ARTICLE_FIELDS}`
    );

    return mapPost(article);
  }

  async createPost(payload: CreatePostPayload): Promise<BlogPost> {
    const article = await this.host.fetchYouTrack<YTArticle>(
      'articles',
      {
        method: 'POST',
        body: {
          summary: payload.summary,
          content: payload.content,
          parentArticle: {id: payload.parentArticleId},
          project: {id: payload.projectId},
        },
        headers: {'Content-Type': 'application/json'},
        query: {fields: ARTICLE_FIELDS},
      }
    );

    return mapPost(article);
  }

  async updatePost(articleId: string, payload: UpdatePostPayload): Promise<BlogPost> {
    const body: Record<string, string> = {};
    if (payload.summary !== undefined) {
      body.summary = payload.summary;
    }
    if (payload.content !== undefined) {
      body.content = payload.content;
    }

    const article = await this.host.fetchYouTrack<YTArticle>(
      `articles/${articleId}`,
      {
        method: 'POST',
        body,
        headers: {'Content-Type': 'application/json'},
        query: {fields: ARTICLE_FIELDS},
      }
    );

    return mapPost(article);
  }

  async toggleStar(articleId: string, hasStar: boolean): Promise<void> {
    await this.host.fetchYouTrack(
      `articles/${articleId}`,
      {
        method: 'POST',
        body: {hasStar},
        headers: {'Content-Type': 'application/json'},
      }
    );
  }

  async deletePost(articleId: string): Promise<void> {
    await this.host.fetchYouTrack(
      `articles/${articleId}`,
      {method: 'DELETE'}
    );
  }

  async getComments(articleId: string): Promise<readonly ArticleComment[]> {
    const comments = await this.host.fetchYouTrack<readonly YTComment[]>(
      `articles/${articleId}/comments?fields=id,text,created,author(login,fullName,avatarUrl,ringId)&$top=100`
    );

    return comments.map(mapComment);
  }

  async addComment(articleId: string, text: string): Promise<ArticleComment> {
    const comment = await this.host.fetchYouTrack<YTComment>(
      `articles/${articleId}/comments`,
      {
        method: 'POST',
        body: {text},
        headers: {'Content-Type': 'application/json'},
        query: {fields: 'id,text,created,author(login,fullName,avatarUrl,ringId)'},
      }
    );

    return mapComment(comment);
  }
}

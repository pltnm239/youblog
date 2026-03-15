import type {Blog, BlogPost, ArticleComment, CreatePostPayload, UpdatePostPayload} from '../types';

export interface ArticlesRepository {
  getBlogs(projectShortName: string): Promise<readonly Blog[]>;
  getPosts(blogArticleId: string): Promise<readonly BlogPost[]>;
  getPost(articleId: string): Promise<BlogPost>;
  createPost(payload: CreatePostPayload): Promise<BlogPost>;
  updatePost(articleId: string, payload: UpdatePostPayload): Promise<BlogPost>;
  deletePost(articleId: string): Promise<void>;
  toggleStar(articleId: string, hasStar: boolean): Promise<void>;
  getComments(articleId: string): Promise<readonly ArticleComment[]>;
  addComment(articleId: string, text: string): Promise<ArticleComment>;
}

export interface BlogConfig {
  projectId: string;
  projectName: string;
  projectShortName: string;
}

export interface Blog {
  id: string;
  idReadable: string;
  summary: string;
  content: string;
  created: number;
  updated: number;
  author: Author;
  childCount: number;
}

export interface Author {
  login: string;
  fullName: string;
  avatarUrl: string;
  ringId: string;
}

export interface BlogPost {
  id: string;
  idReadable: string;
  summary: string;
  content: string;
  created: number;
  updated: number;
  author: Author;
  parentArticle: {
    id: string;
    idReadable: string;
    summary: string;
  } | null;
  tags: readonly ArticleTag[];
  commentsCount: number;
  hasStar: boolean;
}

export interface ArticleTag {
  id: string;
  name: string;
}

export interface ArticleComment {
  id: string;
  text: string;
  created: number;
  author: Author;
}

export interface CreatePostPayload {
  summary: string;
  content: string;
  parentArticleId: string;
  projectId: string;
}

export interface UpdatePostPayload {
  summary?: string;
  content?: string;
}

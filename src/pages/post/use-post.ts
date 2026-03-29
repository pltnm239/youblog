import {useEffect, useState, useCallback} from 'react';

import type {BlogPost, ArticleComment} from '../../api/types';
import {useHost} from '../../api/host-context';
import {YtArticlesRepository} from '../../api/articles/yt-articles-repository';

interface UsePostResult {
  post: BlogPost | null;
  comments: readonly ArticleComment[];
  loading: boolean;
  commentsLoading: boolean;
  addComment: (text: string) => Promise<void>;
}

export function usePost(postId: string): UsePostResult {
  const host = useHost();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<readonly ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const repo = new YtArticlesRepository(host);
    setLoading(true);
    setCommentsLoading(true);

    repo.getPost(postId).then(loadedPost => {
      setPost(loadedPost);
      setLoading(false);
    });

    repo.getComments(postId).then(loadedComments => {
      setComments(loadedComments);
      setCommentsLoading(false);
    });
  }, [host, postId]);

  const addComment = useCallback(async (text: string) => {
    const repo = new YtArticlesRepository(host);
    const newComment = await repo.addComment(postId, text);
    setComments(prev => [...prev, newComment]);
  }, [host, postId]);

  return {post, comments, loading, commentsLoading, addComment};
}

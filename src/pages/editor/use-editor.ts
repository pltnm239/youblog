import {useEffect, useState, useCallback} from 'react';

import type {BlogPost, BlogConfig} from '../../api/types';
import {useHost} from '../../api/host-context';
import {YtArticlesRepository} from '../../api/articles/yt-articles-repository';

interface UseEditorResult {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  loading: boolean;
  saving: boolean;
  save: () => Promise<BlogPost | null>;
  blogTitle: string;
}

export function useEditor(blogId: string, postId?: string): UseEditorResult {
  const host = useHost();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    const repo = new YtArticlesRepository(host);

    repo.getPost(blogId).then(blogArticle => {
      setBlogTitle(blogArticle.summary);
    });

    if (postId) {
      setLoading(true);
      repo.getPost(postId).then(post => {
        setTitle(post.summary);
        setContent(post.content);
        setLoading(false);
      });
    }

    host.fetchYouTrack<{project?: {id: string}}>(`articles/${blogId}?fields=project(id)`).then(
      result => {
        if (result.project) {
          setProjectId(result.project.id);
        }
      }
    );
  }, [host, blogId, postId]);

  const save = useCallback(async (): Promise<BlogPost | null> => {
    if (!title.trim() || !content.trim()) return null;

    setSaving(true);
    try {
      const repo = new YtArticlesRepository(host);

      if (postId) {
        return await repo.updatePost(postId, {summary: title, content});
      } else {
        return await repo.createPost({
          summary: title,
          content,
          parentArticleId: blogId,
          projectId,
        });
      }
    } finally {
      setSaving(false);
    }
  }, [host, title, content, blogId, postId, projectId]);

  return {title, setTitle, content, setContent, loading, saving, save, blogTitle};
}

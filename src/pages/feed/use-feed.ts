import {useEffect, useState} from 'react';

import type {BlogPost} from '../../api/types';
import {useHost} from '../../api/host-context';
import {YtArticlesRepository} from '../../api/articles/yt-articles-repository';

interface UseFeedResult {
  posts: readonly BlogPost[];
  blogTitle: string;
  blogIdReadable: string;
  loading: boolean;
}

export function useFeed(blogId: string): UseFeedResult {
  const host = useHost();
  const [posts, setPosts] = useState<readonly BlogPost[]>([]);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogIdReadable, setBlogIdReadable] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo = new YtArticlesRepository(host);
    setLoading(true);

    Promise.all([
      repo.getPosts(blogId),
      repo.getPost(blogId),
    ]).then(([loadedPosts, blogArticle]) => {
      setPosts(loadedPosts);
      setBlogTitle(blogArticle.summary);
      setBlogIdReadable(blogArticle.idReadable);
      setLoading(false);
    });
  }, [host, blogId]);

  return {posts, blogTitle, blogIdReadable, loading};
}

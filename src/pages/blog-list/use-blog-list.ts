import {useEffect, useState} from 'react';

import type {Blog, BlogConfig} from '../../api/types';
import {useHost} from '../../api/host-context';
import {YtArticlesRepository} from '../../api/articles/yt-articles-repository';

interface UseBlogListResult {
  blogs: readonly Blog[];
  loading: boolean;
}

export function useBlogList(config: BlogConfig): UseBlogListResult {
  const host = useHost();
  const [blogs, setBlogs] = useState<readonly Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo = new YtArticlesRepository(host);
    setLoading(true);
    repo.getBlogs(config.projectShortName).then(result => {
      setBlogs(result);
      setLoading(false);
    });
  }, [host, config.projectShortName]);

  return {blogs, loading};
}

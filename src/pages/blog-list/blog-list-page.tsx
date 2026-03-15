import React from 'react';
import Text from '@jetbrains/ring-ui-built/components/text/text';

import type {BlogConfig} from '../../api/types';
import {useNavigation} from '../../navigation';
import {Page} from '../../components/page/page';
import {useBlogList} from './use-blog-list';

import styles from './blog-list-page.module.css';

interface BlogListPageProps {
  config: BlogConfig;
}

export const BlogListPage: React.FunctionComponent<BlogListPageProps> = ({config}) => {
  const {goToFeed} = useNavigation();
  const {blogs, loading} = useBlogList(config);

  if (loading) {
    return null;
  }

  if (blogs.length === 0) {
    return (
      <Page>
        <div className={styles.empty}>
          <Text size={Text.Size.L}>No Blogs Found</Text>
          <Text size={Text.Size.M} className={styles.emptyText}>
            Create a root-level article in the project &quot;{config.projectName}&quot; to start a blog.
          </Text>
        </div>
      </Page>
    );
  }

  if (blogs.length === 1) {
    goToFeed(blogs[0].id);
    return null;
  }

  return (
    <Page>
      <h1 className={styles.heading}>Blogs</h1>
      <div className={styles.grid}>
        {blogs.map(blog => (
          <div key={blog.id} className={styles.card} onClick={() => goToFeed(blog.id)} role="button" tabIndex={0}>
            <h2 className={styles.blogTitle}>{blog.summary}</h2>
            <Text className={styles.blogMeta}>
              {blog.childCount} {blog.childCount === 1 ? 'post' : 'posts'}
            </Text>
            {blog.content && (
              <Text className={styles.blogDesc}>{blog.content.slice(0, 150)}</Text>
            )}
          </div>
        ))}
      </div>
    </Page>
  );
};

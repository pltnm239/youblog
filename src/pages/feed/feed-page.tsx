import React, {useState, useMemo} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';

import Pager from '@jetbrains/ring-ui-built/components/pager/pager';

import type {BlogConfig} from '../../api/types';
import {useNavigation} from '../../navigation';
import {useDebouncedValue} from '../../utils';
import {Page} from '../../components/page/page';
import {Breadcrumbs} from '../../components/breadcrumbs/breadcrumbs';
import {SearchInput} from '../../components/search-input/search-input';
import {PostCard} from '../../components/post-card/post-card';
import {useFeed} from './use-feed';

import styles from './feed-page.module.css';

const POSTS_PER_PAGE = 10;

interface FeedPageProps {
  blogId: string;
  config: BlogConfig;
  authorLogin?: string;
}

export const FeedPage: React.FunctionComponent<FeedPageProps> = ({blogId, config, authorLogin}) => {
  const {goToPost, goToBlogList} = useNavigation();
  const {posts, blogTitle, blogIdReadable, loading} = useFeed(blogId);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState<string | undefined>(authorLogin);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (authorFilter) {
      result = result.filter(post => post.author.login === authorFilter);
    }

    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(post =>
        post.summary.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.fullName.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    return result;
  }, [posts, debouncedQuery, authorFilter]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const authorName = authorFilter
    ? posts.find(p => p.author.login === authorFilter)?.author.fullName
    : undefined;

  const handleAuthorClick = (login: string) => {
    setAuthorFilter(login);
    setCurrentPage(1);
  };

  const breadcrumbs = [
    {label: 'Blogs', onClick: goToBlogList},
    {label: blogTitle || 'Blog', onClick: authorFilter ? () => setAuthorFilter(undefined) : undefined},
    ...(authorFilter && authorName ? [{label: `Posts by ${authorName}`}] : []),
  ];

  return (
    <Page>
      <Breadcrumbs items={breadcrumbs} />

      <div className={styles.header}>
        <h1 className={styles.title}>{blogTitle || 'Blog'}</h1>
        <Button
          primary
          href={`/articles/n?parentArticleId=${blogIdReadable}`}
          target="_top"
        >
          New Post
        </Button>
      </div>

      {authorFilter && authorName && (
        <div className={styles.authorFilter}>
          Posts by {authorName}
          <Button text onClick={() => setAuthorFilter(undefined)}>Clear filter</Button>
        </div>
      )}

      <div className={styles.search}>
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      {paginatedPosts.length === 0 ? (
        <div className={styles.empty}>
          {debouncedQuery.trim() || authorFilter
            ? 'No posts match your filter.'
            : 'No posts yet. Create the first one!'
          }
        </div>
      ) : (
        <div className={styles.posts}>
          {paginatedPosts.map(post => (
            <PostCard key={post.id} post={post} onClick={() => goToPost(post.id)} onAuthorClick={handleAuthorClick} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pager}>
          <Pager
            total={filteredPosts.length}
            currentPage={currentPage}
            pageSize={POSTS_PER_PAGE}
            onPageChange={setCurrentPage}
            visiblePagesLimit={7}
            disablePageSizeSelector
          />
        </div>
      )}
    </Page>
  );
};

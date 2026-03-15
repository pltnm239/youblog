import React from 'react';

import type {BlogConfig} from '../../api/types';
import {useNavigation} from '../../navigation';
import {formatDate, getReadingTime} from '../../utils';
import {Page} from '../../components/page/page';
import {Breadcrumbs} from '../../components/breadcrumbs/breadcrumbs';
import {PostContent} from '../../components/post-content/post-content';
import {TagList} from '../../components/tag-list/tag-list';
import {CommentSection} from '../../components/comment-section/comment-section';
import {usePost} from './use-post';

import styles from './post-page.module.css';

interface PostPageProps {
  postId: string;
  config: BlogConfig;
}

export const PostPage: React.FunctionComponent<PostPageProps> = ({postId, config}) => {
  const {goToFeed, goToBlogList} = useNavigation();
  const {post, comments, loading, commentsLoading, addComment, toggleStar} = usePost(postId);

  if (loading || !post) {
    return null;
  }

  const breadcrumbs = [
    {label: 'Blogs', onClick: goToBlogList},
    ...(post.parentArticle
      ? [{label: post.parentArticle.summary, onClick: () => goToFeed(post.parentArticle!.id)}]
      : []),
  ];

  return (
    <Page>
      <Breadcrumbs items={breadcrumbs} />

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{post.summary}</h1>
            <button
              type="button"
              className={post.hasStar ? styles.starActive : styles.star}
              onClick={toggleStar}
              title={post.hasStar ? 'Remove from favorites' : 'Add to favorites'}
            >
              {post.hasStar ? '\u2605' : '\u2606'}
            </button>
          </div>
          <div className={styles.meta}>
            {post.author.avatarUrl && (
              <img src={post.author.avatarUrl} alt="" className={styles.avatar} />
            )}
            <button
              type="button"
              className={styles.authorLink}
              onClick={() => {
                if (post.parentArticle) {
                  goToFeed(post.parentArticle.id, post.author.login);
                }
              }}
            >
              {post.author.fullName}
            </button>
            <span className={styles.separator}>·</span>
            <time className={styles.date}>{formatDate(post.created)}</time>
            <span className={styles.separator}>·</span>
            <span className={styles.readingTime}>{getReadingTime(post.content)} min read</span>
            {post.tags.length > 0 && (
              <>
                <span className={styles.separator}>·</span>
                <TagList tags={post.tags} />
              </>
            )}
          </div>
        </header>

        <PostContent content={post.content} />
      </article>

      <CommentSection
        comments={comments}
        loading={commentsLoading}
        onAddComment={addComment}
      />
    </Page>
  );
};

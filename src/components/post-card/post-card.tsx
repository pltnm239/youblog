import React from 'react';
import Text from '@jetbrains/ring-ui-built/components/text/text';

import type {BlogPost} from '../../api/types';
import {getSnippet, formatDate, getReadingTime} from '../../utils';
import {TagList} from '../tag-list/tag-list';

import styles from './post-card.module.css';

interface PostCardProps {
  post: BlogPost;
  onClick: () => void;
  onAuthorClick?: (login: string) => void;
}

export const PostCard: React.FunctionComponent<PostCardProps> = ({post, onClick, onAuthorClick}) => (
  <article className={styles.card} onClick={onClick} role="button" tabIndex={0}>
    <div className={styles.content}>
      <div className={styles.titleRow}>
        <h2 className={styles.title}>{post.summary}</h2>
        {post.hasStar && <span className={styles.starIndicator}>{'\u2605'}</span>}
      </div>
      <div className={styles.meta}>
        {post.author.avatarUrl && (
          <img src={post.author.avatarUrl} alt="" className={styles.avatar} />
        )}
        <button
          type="button"
          className={styles.authorLink}
          onClick={e => {
            e.stopPropagation();
            onAuthorClick?.(post.author.login);
          }}
        >
          {post.author.fullName}
        </button>
        <span className={styles.separator}>·</span>
        <time className={styles.date}>{formatDate(post.created)}</time>
        <span className={styles.separator}>·</span>
        <span className={styles.readingTime}>{getReadingTime(post.content)} min read</span>
        {post.commentsCount > 0 && (
          <>
            <span className={styles.separator}>·</span>
            <span className={styles.comments}>
              {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
            </span>
          </>
        )}
      </div>
      <Text className={styles.snippet}>{getSnippet(post.content)}</Text>
      {post.tags.length > 0 && (
        <div className={styles.tags}>
          <TagList tags={post.tags} />
        </div>
      )}
    </div>
  </article>
);

import React, {useState, useCallback} from 'react';

import type {ArticleComment} from '../../api/types';
import {formatDate} from '../../utils';

import styles from './comment-section.module.css';

interface CommentSectionProps {
  comments: readonly ArticleComment[];
  loading: boolean;
  onAddComment: (text: string) => Promise<void>;
}

export const CommentSection: React.FunctionComponent<CommentSectionProps> = ({
  comments,
  loading,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const text = commentText.trim();
    if (!text) return;

    setSubmitting(true);
    try {
      await onAddComment(text);
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  }, [commentText, onAddComment]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {loading && <div className={styles.loading}>Loading comments...</div>}

      {!loading && comments.length === 0 && (
        <div className={styles.empty}>No comments yet. Be the first to comment!</div>
      )}

      {comments.map(comment => (
        <div key={comment.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            {comment.author.avatarUrl && (
              <img src={comment.author.avatarUrl} alt="" className={styles.commentAvatar} />
            )}
            <span className={styles.commentAuthor}>{comment.author.fullName}</span>
            <time className={styles.commentDate}>{formatDate(comment.created)}</time>
          </div>
          <div className={styles.commentText}>{comment.text}</div>
        </div>
      ))}

      <div className={styles.form}>
        <textarea
          className={styles.textarea}
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a comment... (Ctrl+Enter to send)"
          rows={3}
          disabled={submitting}
        />
      </div>
    </div>
  );
};

import React from 'react';
import TagComponent from '@jetbrains/ring-ui-built/components/tag/tag';

import type {ArticleTag} from '../../api/types';

import styles from './tag-list.module.css';

interface TagListProps {
  tags: readonly ArticleTag[];
  selectedTagId?: string;
  onTagClick?: (tag: ArticleTag) => void;
}

export const TagList: React.FunctionComponent<TagListProps> = ({tags, selectedTagId, onTagClick}) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.tags}>
      {tags.map(tag => (
        <TagComponent
          key={tag.id}
          readOnly={!onTagClick}
          className={tag.id === selectedTagId ? styles.selected : undefined}
          onClick={onTagClick ? () => onTagClick(tag) : undefined}
        >
          {tag.name}
        </TagComponent>
      ))}
    </div>
  );
};

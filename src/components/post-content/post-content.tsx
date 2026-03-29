import React from 'react';

import type {RenderedPostContent} from './render-post-content';
import styles from './post-content.module.css';

interface PostContentProps {
  renderedContent: RenderedPostContent;
}

export const PostContent: React.FunctionComponent<PostContentProps> = ({renderedContent}) => (
  <div
    className={styles.content}
    dangerouslySetInnerHTML={{__html: renderedContent.html}}
  />
);

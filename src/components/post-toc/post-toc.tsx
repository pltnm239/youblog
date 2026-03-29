import React from 'react';
import Link from '@jetbrains/ring-ui-built/components/link/link';

import styles from './post-toc.module.css';

interface TocItem {
  id: string;
  title: string;
  level: number;
  url: string;
}

interface PostTocProps {
  items: readonly TocItem[];
  activeId: string;
}

function scrollToHeading(id: string): void {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function getLinkClassName(level: number, isActive: boolean): string {
  const levelClassName =
    level === 1 ? styles.linkLevel1 : level === 2 ? styles.linkLevel2 : styles.linkLevel3;

  return `${isActive ? styles.linkActive : styles.link} ${levelClassName}`;
}

export const PostToc: React.FunctionComponent<PostTocProps> = ({items, activeId}) => (
  <aside className={styles.sidebar} aria-label="Article sections">
    <div className={styles.card}>
      <nav className={styles.list}>
        {items.map(item => (
          <Link
            key={item.id}
            href={item.url}
            className={getLinkClassName(item.level, item.id === activeId)}
            onClick={event => {
              event.preventDefault();
              scrollToHeading(item.id);
            }}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  </aside>
);

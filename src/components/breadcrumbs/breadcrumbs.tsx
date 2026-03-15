import React from 'react';

import styles from './breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
}

export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({items}) => (
  <nav className={styles.breadcrumbs}>
    {items.map((item, index) => (
      <span key={index} className={styles.item}>
        {index > 0 && <span className={styles.separator}>/</span>}
        {item.onClick ? (
          <button type="button" className={styles.link} onClick={item.onClick}>
            {item.label}
          </button>
        ) : (
          <span className={styles.current}>{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

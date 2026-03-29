import React from 'react';
import RingBreadcrumbs from '@jetbrains/ring-ui-built/components/breadcrumbs/breadcrumbs';
import Link from '@jetbrains/ring-ui-built/components/link/link';

import styles from './breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: readonly BreadcrumbItem[];
}

export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({items}) => (
  <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
    <RingBreadcrumbs separatorClassName={styles.separator}>
      {items.map((item, index) => {
        if (item.onClick) {
          return (
            <Link
              key={`${item.label}-${index}`}
              pseudo
              className={styles.link}
              onClick={item.onClick}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <span key={`${item.label}-${index}`} className={styles.current} aria-current="page">
            {item.label}
          </span>
        );
      })}
    </RingBreadcrumbs>
  </nav>
);

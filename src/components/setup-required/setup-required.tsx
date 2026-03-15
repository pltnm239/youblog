import React from 'react';
import Text from '@jetbrains/ring-ui-built/components/text/text';

import styles from './setup-required.module.css';

export const SetupRequired: React.FunctionComponent = () => (
  <div className={styles.container}>
    <div className={styles.content}>
      <Text size={Text.Size.L}>Blog Setup Required</Text>
      <Text size={Text.Size.M} className={styles.description}>
        To get started, open the app settings and select a project whose articles will power the blog.
      </Text>
    </div>
  </div>
);

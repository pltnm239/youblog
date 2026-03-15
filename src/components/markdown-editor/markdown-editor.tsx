import React, {useState} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';

import {PostContent} from '../post-content/post-content';

import styles from './markdown-editor.module.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type EditorTab = 'write' | 'preview';

export const MarkdownEditor: React.FunctionComponent<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your post content in Markdown...',
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>('write');

  return (
    <div className={styles.editor}>
      <div className={styles.tabs}>
        <Button
          text
          active={activeTab === 'write'}
          onClick={() => setActiveTab('write')}
        >
          Write
        </Button>
        <Button
          text
          active={activeTab === 'preview'}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </Button>
      </div>

      {activeTab === 'write' ? (
        <textarea
          className={styles.textarea}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div className={styles.preview}>
          {value.trim() ? (
            <PostContent content={value} />
          ) : (
            <div className={styles.emptyPreview}>Nothing to preview</div>
          )}
        </div>
      )}
    </div>
  );
};

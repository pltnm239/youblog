import React, {useCallback} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';
import Input, {Size as InputSize} from '@jetbrains/ring-ui-built/components/input/input';

import type {BlogConfig} from '../../api/types';
import {useNavigation} from '../../navigation';
import {Page} from '../../components/page/page';
import {Breadcrumbs} from '../../components/breadcrumbs/breadcrumbs';
import {MarkdownEditor} from '../../components/markdown-editor/markdown-editor';
import {useEditor} from './use-editor';

import styles from './editor-page.module.css';

interface EditorPageProps {
  blogId: string;
  postId?: string;
  config: BlogConfig;
}

export const EditorPage: React.FunctionComponent<EditorPageProps> = ({blogId, postId, config}) => {
  const {goToFeed, goToPost, goToBlogList} = useNavigation();
  const {
    title,
    setTitle,
    content,
    setContent,
    loading,
    saving,
    save,
    blogTitle,
  } = useEditor(blogId, postId);

  const handleSave = useCallback(async () => {
    const savedPost = await save();
    if (savedPost) {
      goToPost(savedPost.id);
    }
  }, [save, goToPost]);

  const handleCancel = useCallback(() => {
    if (postId) {
      goToPost(postId);
    } else {
      goToFeed(blogId);
    }
  }, [postId, goToPost, goToFeed, blogId]);

  const breadcrumbs = [
    {label: 'Blogs', onClick: goToBlogList},
    {label: blogTitle || 'Blog', onClick: () => goToFeed(blogId)},
    {label: postId ? 'Edit Post' : 'New Post'},
  ];

  if (loading) {
    return null;
  }

  return (
    <Page>
      <Breadcrumbs items={breadcrumbs} />

      <h1 className={styles.heading}>{postId ? 'Edit Post' : 'New Post'}</h1>

      <div className={styles.form}>
        <div className={styles.field}>
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Post title"
            size={InputSize.FULL}
            className={styles.titleInput}
          />
        </div>

        <div className={styles.field}>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        <div className={styles.actions}>
          <Button
            primary
            disabled={!title.trim() || !content.trim() || saving}
            loader={saving}
            onClick={handleSave}
          >
            {postId ? 'Save Changes' : 'Publish'}
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Page>
  );
};

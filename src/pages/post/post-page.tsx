import React, {useMemo} from 'react';

import type {BlogConfig} from '../../api/types';
import {useNavigation} from '../../navigation';
import {formatDate, getReadingTime} from '../../utils';
import {Page} from '../../components/page/page';
import {Breadcrumbs} from '../../components/breadcrumbs/breadcrumbs';
import {PostContent} from '../../components/post-content/post-content';
import {renderPostContent} from '../../components/post-content/render-post-content';
import {PostToc} from '../../components/post-toc/post-toc';
import {useActivePostToc} from '../../components/post-toc/use-active-post-toc';
import {TagList} from '../../components/tag-list/tag-list';
import {CommentSection} from '../../components/comment-section/comment-section';
import {usePost} from './use-post';

import styles from './post-page.module.css';

interface PostPageProps {
  postId: string;
  config: BlogConfig;
}

export const PostPage: React.FunctionComponent<PostPageProps> = ({postId, config}) => {
  const {goToFeed, goToBlogList} = useNavigation();
  const {post, comments, loading, commentsLoading, addComment} = usePost(postId);
  const renderedContent = useMemo(() => renderPostContent(post?.content ?? ''), [post?.content]);
  const tocItems = useMemo(
    () => post
      ? [{id: 'post-title', title: post.summary, level: 1, url: '#post-title'}, ...renderedContent.headings]
      : [],
    [post, renderedContent.headings],
  );
  const activeTocId = useActivePostToc(tocItems);

  if (loading || !post) {
    return null;
  }

  const breadcrumbs = [
    {label: 'Blogs', onClick: goToBlogList},
    ...(post.parentArticle
      ? [{label: post.parentArticle.summary, onClick: () => goToFeed(post.parentArticle!.id)}]
      : []),
  ];

  return (
    <Page wide>
      <Breadcrumbs items={breadcrumbs} />
      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <article className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title} id="post-title">{post.summary}</h1>
              <div className={styles.meta}>
                {post.author.avatarUrl && (
                  <img src={post.author.avatarUrl} alt="" className={styles.avatar} />
                )}
                <button
                  type="button"
                  className={styles.authorLink}
                  onClick={() => {
                    if (post.parentArticle) {
                      goToFeed(post.parentArticle.id, post.author.login);
                    }
                  }}
                >
                  {post.author.fullName}
                </button>
                <span className={styles.separator}>·</span>
                <time className={styles.date}>{formatDate(post.created)}</time>
                <span className={styles.separator}>·</span>
                <span className={styles.readingTime}>{getReadingTime(post.content)} min read</span>
                {post.tags.length > 0 && (
                  <>
                    <span className={styles.separator}>·</span>
                    <TagList tags={post.tags} />
                  </>
                )}
              </div>
            </header>

            <PostContent renderedContent={renderedContent} />
          </article>

          <CommentSection
            comments={comments}
            loading={commentsLoading}
            onAddComment={addComment}
          />
        </div>

        {tocItems.length > 0 && <PostToc items={tocItems} activeId={activeTocId} />}
      </div>
    </Page>
  );
};

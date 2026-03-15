import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {NavigationProvider} from './navigation';
import {useHost} from './api/host-context';
import {AppConfigRepository} from './api/config/app-config-repository';
import type {BlogConfig} from './api/types';
import {SetupRequired} from './components/setup-required/setup-required';
import {BlogListPage} from './pages/blog-list/blog-list-page';
import {FeedPage} from './pages/feed/feed-page';
import {PostPage} from './pages/post/post-page';
import {EditorPage} from './pages/editor/editor-page';

export type Route =
  | {name: 'blog-list'}
  | {name: 'feed'; blogId: string; authorLogin?: string}
  | {name: 'post'; postId: string}
  | {name: 'editor'; blogId: string; postId?: string};

const App = () => {
  const host = useHost();
  const [route, setRoute] = useState<Route>({name: 'blog-list'});
  const [config, setConfig] = useState<BlogConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    const configRepository = new AppConfigRepository(host);
    configRepository.getConfig().then(loadedConfig => {
      if (loadedConfig) {
        setConfig(loadedConfig);
      }
      setConfigLoading(false);
    });
  }, [host]);

  const goToFeed = useCallback((blogId: string, authorLogin?: string) => {
    setRoute({name: 'feed', blogId, authorLogin});
  }, []);

  const goToPost = useCallback((postId: string) => {
    setRoute({name: 'post', postId});
  }, []);

  const goToEditor = useCallback((blogId: string, postId?: string) => {
    setRoute({name: 'editor', blogId, postId});
  }, []);

  const goToBlogList = useCallback(() => {
    setRoute({name: 'blog-list'});
  }, []);

  const navigationState = useMemo(
    () => ({goToFeed, goToPost, goToEditor, goToBlogList}),
    [goToFeed, goToPost, goToEditor, goToBlogList],
  );

  if (configLoading) {
    return null;
  }

  if (!config) {
    return <SetupRequired />;
  }

  const renderRoute = () => {
    switch (route.name) {
      case 'feed':
        return <FeedPage blogId={route.blogId} config={config} authorLogin={route.authorLogin} />;
      case 'post':
        return <PostPage postId={route.postId} config={config} />;
      case 'editor':
        return <EditorPage blogId={route.blogId} postId={route.postId} config={config} />;
      default:
        return <BlogListPage config={config} />;
    }
  };

  return (
    <NavigationProvider value={navigationState}>
      {renderRoute()}
    </NavigationProvider>
  );
};

export default App;

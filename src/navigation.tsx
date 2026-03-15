import {createContext, useContext} from 'react';

export interface NavigationState {
  goToFeed: (blogId: string, authorLogin?: string) => void;
  goToPost: (postId: string) => void;
  goToEditor: (blogId: string, postId?: string) => void;
  goToBlogList: () => void;
}

const NavigationContext = createContext<NavigationState | null>(null);

export const NavigationProvider = NavigationContext.Provider;

export const useNavigation = (): NavigationState => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('Navigation context is missing');
  }
  return context;
};

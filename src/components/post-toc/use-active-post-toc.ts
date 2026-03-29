import {useEffect, useState} from 'react';

interface TocItem {
  id: string;
}

const ACTIVE_HEADING_OFFSET = 96;

export function useActivePostToc(items: readonly TocItem[]): string {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const getNextActiveId = () => {
      let nextActiveId = items[0]?.id ?? '';

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET) {
          nextActiveId = item.id;
        } else {
          break;
        }
      }

      setActiveId(previousActiveId => (previousActiveId === nextActiveId ? previousActiveId : nextActiveId));
    };

    getNextActiveId();
    window.addEventListener('scroll', getNextActiveId, {passive: true});
    window.addEventListener('resize', getNextActiveId);

    return () => {
      window.removeEventListener('scroll', getNextActiveId);
      window.removeEventListener('resize', getNextActiveId);
    };
  }, [items]);

  return activeId;
}

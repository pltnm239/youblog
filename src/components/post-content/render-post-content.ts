export interface PostHeading {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  url: string;
}

export interface RenderedPostContent {
  html: string;
  headings: readonly PostHeading[];
}

function stripLeadingTitle(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]+\n*/, '');
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .trim();
}

function createHeadingId(title: string, usedIds: Set<string>): string {
  const normalized = stripInlineMarkdown(title)
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const baseId = normalized || 'section';

  if (!usedIds.has(baseId)) {
    usedIds.add(baseId);
    return baseId;
  }

  let index = 2;
  let nextId = `${baseId}-${index}`;
  while (usedIds.has(nextId)) {
    index += 1;
    nextId = `${baseId}-${index}`;
  }
  usedIds.add(nextId);
  return nextId;
}

function extractHeadings(markdown: string): readonly PostHeading[] {
  const usedIds = new Set<string>();

  return markdown
    .split('\n')
    .flatMap(line => {
      const match = line.match(/^(#{1,3})\s+(.+?)\s*$/);
      if (!match) {
        return [];
      }

      const title = stripInlineMarkdown(match[2]);
      if (!title) {
        return [];
      }

      const level = match[1].length as 1 | 2 | 3;
      const id = createHeadingId(title, usedIds);

      return [{id, title, level, url: `#${id}`}];
    });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markdownToHtml(markdown: string): string {
  let html = markdown;

  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) => `<pre><code>${escapeHtml(code.trim())}</code></pre>`,
  );

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="post-image" />');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/^---$/gm, '<hr />');

  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (const line of lines) {
    const unorderedListMatch = line.match(/^[-*+]\s+(.+)/);
    const orderedListMatch = line.match(/^\d+\.\s+(.+)/);

    if (unorderedListMatch) {
      if (!inList || listType !== 'ul') {
        if (inList) {
          result.push(`</${listType}>`);
        }
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${unorderedListMatch[1]}</li>`);
      continue;
    }

    if (orderedListMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) {
          result.push(`</${listType}>`);
        }
        result.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      result.push(`<li>${orderedListMatch[1]}</li>`);
      continue;
    }

    if (inList) {
      result.push(`</${listType}>`);
      inList = false;
      listType = null;
    }

    if (line.trim() === '') {
      result.push('');
      continue;
    }

    if (!line.startsWith('<')) {
      result.push(`<p>${line}</p>`);
      continue;
    }

    result.push(line);
  }

  if (inList) {
    result.push(`</${listType}>`);
  }

  return result.join('\n');
}

function injectHeadingIds(html: string, headings: readonly PostHeading[]): string {
  let headingIndex = 0;

  return html.replace(/<h([1-3])>(.*?)<\/h\1>/g, (match, level) => {
    const heading = headings[headingIndex];
    if (!heading || heading.level !== Number(level)) {
      return match;
    }

    headingIndex += 1;
    return match.replace(/<h([1-3])>/, `<h${level} id="${heading.id}">`);
  });
}

export function renderPostContent(content: string): RenderedPostContent {
  const markdown = stripLeadingTitle(content);
  const headings = extractHeadings(markdown);
  const html = injectHeadingIds(markdownToHtml(markdown), headings);

  return {html, headings};
}

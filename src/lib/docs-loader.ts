// src/lib/docs-loader.ts

export interface DocMetadata {
  title: string;
  description?: string;
  order?: number;
  category?: string;
  slug: string;
  filePath: string;
}

export interface DocSection {
  id: string;
  title: string;
  rawContent: string;
  metadata: DocMetadata;
}

export interface DocCategory {
  id: string;
  title: string;
  sections: DocSection[];
}

// Lightweight Frontmatter Parser (No dependencies)
const parseFrontmatter = (content: string) => {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
  const match = content.match(frontmatterRegex);
  
  const metadata: Record<string, string | number> = {};
  let rawBody = content;

  if (match) {
    const yamlString = match[1];
    rawBody = content.slice(match[0].length);
    
    yamlString.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
        metadata[key] = isNaN(Number(value)) ? value : Number(value);
      }
    });
  }

  return { metadata, body: rawBody };
};

// Use Vite's Glob Import to scan for manual markdown files
// We match all .md files in the docs-content folder recursively
const modules = import.meta.glob('/docs-content/**/*.md', { query: '?raw', eager: true });

// Manual mapping for files without frontmatter or folders to place them in correct categories
const fileToCategoryMap: Record<string, string> = {
  'docs': 'introduction',
  'quickstart': 'introduction',
  'installation': 'introduction',
  'folder-structure': 'introduction',
  'routing': 'core-concepts',
  'http-context': 'core-concepts',
  'middleware': 'core-concepts',
  'validation': 'core-concepts',
  'auth': 'auth',
  'orm': 'database',
  'migrations': 'database',
  'storage': 'database',
  'queues': 'advanced',
  'events': 'advanced',
  'testing': 'advanced',
  'deployment': 'development',
  'observability': 'development'
};

export const getDocsData = (): DocCategory[] => {
  const categoriesMap: Record<string, DocSection[]> = {};

  Object.entries(modules).forEach(([path, mod]) => {
    const content = (mod as any).default as string;
    const { metadata, body } = parseFrontmatter(content);
    
    // Extract ID (filename without leading numbering and extension)
    const pathParts = path.split('/');
    const fileName = pathParts.pop()?.replace('.md', '') || '';
    const id = fileName.replace(/^\d+-/, '');
    
    // Infer category from:
    // 1. Frontmatter
    // 2. Folder name (if not root)
    // 3. Manual map
    // 4. Fallback to 'introduction'
    const parentFolder = pathParts[pathParts.length - 1];
    const folderCategory = parentFolder === 'docs-content' ? null : parentFolder;
    const categoryName = (metadata.category as string) || folderCategory || fileToCategoryMap[id] || 'introduction';
    
    const title = (metadata.title as string) || id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    const section: DocSection = {
      id,
      title: title || 'Untitled',
      rawContent: body,
      metadata: {
        title: title || 'Untitled',
        description: (metadata.description as string) || '',
        order: (metadata.order as number) || parseInt(fileName.match(/^\d+/)?.[0] || '999'),
        category: categoryName,
        slug: id,
        filePath: path
      }
    };

    if (!categoriesMap[categoryName]) {
      categoriesMap[categoryName] = [];
    }
    categoriesMap[categoryName].push(section);
  });

  // Predefined order for categories
  const categoryOrder = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'core-concepts', title: 'Core Concepts' },
    { id: 'database', title: 'Database & Storage' },
    { id: 'auth', title: 'Authentication' },
    { id: 'advanced', title: 'Advanced Guides' },
    { id: 'development', title: 'Development & Ops' }
  ];

  // Also include any categories discovered but not in the predefined list
  const allCategoryIds = [...new Set([...categoryOrder.map(c => c.id), ...Object.keys(categoriesMap)])];

  return allCategoryIds
    .filter(catId => categoriesMap[catId])
    .map(catId => {
      const predefined = categoryOrder.find(c => c.id === catId);
      return {
        id: catId,
        title: predefined?.title || catId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        sections: categoriesMap[catId].sort((a, b) => (a.metadata.order || 0) - (b.metadata.order || 0))
      };
    })
    .sort((a, b) => {
        const indexA = categoryOrder.findIndex(c => c.id === a.id);
        const indexB = categoryOrder.findIndex(c => c.id === b.id);
        if (indexA === -1 && indexB === -1) return a.title.localeCompare(b.title);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
};

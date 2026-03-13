export interface DocSection {
  id: string;
  title: string;
}

export interface DocCategory {
  id: string;
  title: string;
  sections: DocSection[];
}

export const DOCS_CONFIG: DocCategory[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    sections: [
      { id: 'docs', title: 'Overview' },
      { id: 'quickstart', title: 'Quickstart' },
      { id: 'installation', title: 'Installation' },
      { id: 'folder-structure', title: 'Folder Structure' },
    ],
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    sections: [
      { id: 'routing', title: 'Routing' },
      { id: 'http-context', title: 'HTTP Context' },
      { id: 'middleware', title: 'Middleware' },
    ],
  },
  {
    id: 'database',
    title: 'Database & ORM',
    sections: [
      { id: 'orm', title: 'ORM' },
      { id: 'migrations', title: 'Migrations' },
    ],
  },
  {
    id: 'auth',
    title: 'Authentication & Security',
    sections: [
      { id: 'auth', title: 'Authentication' },
      { id: 'validation', title: 'Validation' },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    sections: [
      { id: 'queues', title: 'Queues' },
      { id: 'events', title: 'Events' },
      { id: 'storage', title: 'Storage' },
    ],
  },
  {
    id: 'development',
    title: 'Development',
    sections: [
      { id: 'testing', title: 'Testing' },
      { id: 'deployment', title: 'Deployment' },
      { id: 'observability', title: 'Observability' },
    ],
  },
];

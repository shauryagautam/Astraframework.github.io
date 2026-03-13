import quickstartMd from '../../docs-content/02-quickstart.md?raw';
import installationMd from '../../docs-content/03-installation.md?raw';
import folderStructureMd from '../../docs-content/04-folder-structure.md?raw';
import routingMd from '../../docs-content/05-routing.md?raw';
import httpContextMd from '../../docs-content/06-http-context.md?raw';
import middlewareMd from '../../docs-content/07-middleware.md?raw';
import authMd from '../../docs-content/08-auth.md?raw';
import ormMd from '../../docs-content/09-orm.md?raw';
import migrationsMd from '../../docs-content/10-migrations.md?raw';
import validationMd from '../../docs-content/11-validation.md?raw';
import queuesMd from '../../docs-content/12-queues.md?raw';
import eventsMd from '../../docs-content/13-events.md?raw';
import storageMd from '../../docs-content/14-storage.md?raw';
import testingMd from '../../docs-content/15-testing.md?raw';
import deploymentMd from '../../docs-content/16-deployment.md?raw';
import observabilityMd from '../../docs-content/17-observability.md?raw';

export interface DocSection {
  id: string;
  title: string;
  rawContent: string;
}

export interface DocCategory {
  id: string;
  title: string;
  sections: DocSection[];
}

export const docsData: DocCategory[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    sections: [
      { id: 'quickstart', title: 'Quickstart', rawContent: quickstartMd },
      { id: 'installation', title: 'Installation', rawContent: installationMd },
      { id: 'folder-structure', title: 'Folder Structure', rawContent: folderStructureMd },
    ],
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    sections: [
      { id: 'routing', title: 'Routing', rawContent: routingMd },
      { id: 'http-context', title: 'HTTP Context', rawContent: httpContextMd },
      { id: 'middleware', title: 'Middleware', rawContent: middlewareMd },
    ],
  },
  {
    id: 'database',
    title: 'Database & ORM',
    sections: [
      { id: 'orm', title: 'ORM', rawContent: ormMd },
      { id: 'migrations', title: 'Migrations', rawContent: migrationsMd },
    ],
  },
  {
    id: 'auth',
    title: 'Authentication & Security',
    sections: [
      { id: 'auth', title: 'Authentication', rawContent: authMd },
      { id: 'validation', title: 'Validation', rawContent: validationMd },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    sections: [
      { id: 'queues', title: 'Queues', rawContent: queuesMd },
      { id: 'events', title: 'Events', rawContent: eventsMd },
      { id: 'storage', title: 'Storage', rawContent: storageMd },
    ],
  },
  {
    id: 'development',
    title: 'Development',
    sections: [
      { id: 'testing', title: 'Testing', rawContent: testingMd },
      { id: 'deployment', title: 'Deployment', rawContent: deploymentMd },
      { id: 'observability', title: 'Observability', rawContent: observabilityMd },
    ],
  },
];

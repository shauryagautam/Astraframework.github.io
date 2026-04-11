import { Link } from 'react-router-dom';

const TOPICS = [
  { name: 'Middleware', path: '/docs/core-concepts/architecture#middleware' },
  { name: 'Validation', path: '/docs/core-concepts/architecture#request-validation' },
  { name: 'Authentication', path: '/docs/auth/security' },
  { name: 'ORM', path: '/docs/database/persistence#why-the-orm-is-generic' },
  { name: 'Migrations', path: '/docs/database/persistence#migrations' },
  { name: 'HTTP Context', path: '/docs/core-concepts/architecture#http-context' },
  { name: 'Testing', path: '/docs/production/testing' },
  { name: 'Deployment', path: '/docs/production/deployment' }
];

export const DocsTopicSearch = () => {
  return (
    <section className="mt-20 pt-16 border-t border-(--t-border)">
      <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-(--t-accent)/40 mb-10">Search by Topic</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
        {TOPICS.map(topic => (
          <Link 
            key={topic.name} 
            to={topic.path}
            className="text-sm font-bold text-(--t-text-muted) hover:text-(--t-accent) transition-colors"
          >
            {topic.name} &rarr;
          </Link>
        ))}
      </div>
    </section>
  );
};

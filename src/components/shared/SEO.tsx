import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/icon.png', 
  url = 'https://astra.dev' 
}: SEOProps) => {
  const siteTitle = 'Astra Framework';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDesc = 'A high-performance Go framework designed for modern backend developers. Built for speed, security, and scalability.';

  useEffect(() => {
    // Update title
    document.title = fullTitle;

    // Update meta tags
    const metaTags = {
      'description': description || defaultDesc,
      'keywords': keywords || 'go, framework, backend, golang, astra, performance',
      'og:title': fullTitle,
      'og:description': description || defaultDesc,
      'og:image': image,
      'og:url': url,
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': description || defaultDesc,
      'twitter:image': image,
    };

    Object.entries(metaTags).forEach(([name, content]) => {
      let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });
  }, [fullTitle, description, keywords, image, url]);

  return null;
};

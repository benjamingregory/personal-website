interface BlogPostJsonLdProps {
  title: string;
  description: string;
  date: string;
  author?: string;
  url: string;
  image?: string;
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostJsonLd({
  title,
  description,
  date,
  author = "Ben Gregory",
  url,
  image,
}: BlogPostJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished: date,
    dateModified: date,
    url: url,
    ...(image ? { image } : {}),
    publisher: {
      "@type": "Person",
      name: author,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return <JsonLdScript data={jsonLd} />;
}

interface WebSiteJsonLdProps {
  name: string;
  description: string;
  url: string;
}

export function WebSiteJsonLd({ name, description, url }: WebSiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: name,
    description: description,
    url: url,
    author: {
      "@type": "Person",
      name: "Ben Gregory",
    },
  };

  return <JsonLdScript data={jsonLd} />;
}

interface PersonJsonLdProps {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  sameAs?: string[];
}

export function PersonJsonLd({
  name,
  jobTitle,
  description,
  url,
  image,
  sameAs = [],
}: PersonJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    jobTitle: jobTitle,
    description: description,
    url: url,
    ...(image ? { image } : {}),
    sameAs: sameAs,
    alumniOf: [
      {
        "@type": "Organization",
        name: "Stanford Graduate School of Business",
      },
    ],
  };

  return <JsonLdScript data={jsonLd} />;
}

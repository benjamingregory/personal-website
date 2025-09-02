import Script from "next/script";

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  date: string;
  author?: string;
  url: string;
  image?: string;
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
    image: image || "https://bengregory.com/og-image.jpg",
    publisher: {
      "@type": "Person",
      name: author,
      logo: {
        "@type": "ImageObject",
        url: "https://bengregory.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <Script
      id="blog-post-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
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
    image: image || "https://bengregory.com/profile.jpg",
    sameAs: sameAs,
    alumniOf: [
      {
        "@type": "Organization",
        name: "Stanford Graduate School of Business",
      },
    ],
  };

  return (
    <Script
      id="person-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}
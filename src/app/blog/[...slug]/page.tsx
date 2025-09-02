import { notFound } from "next/navigation";
import { allBlogPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { useMDXComponents } from "@/mdx-components";
import { BlogPostJsonLd } from "@/components/JsonLd";

interface BlogPostProps {
  params: {
    slug: string[];
  };
}

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.url.split("/").filter((s) => s && s !== "blog"),
  }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const post = allBlogPosts.find((post) => {
    const postSlug = post.url.split("/").filter((s) => s && s !== "blog").join("/");
    const requestSlug = params.slug.join("/");
    return postSlug === requestSlug;
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const canonicalUrl = `https://bengregory.com${post.url}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["Ben Gregory"],
      tags: post.tags,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPost({ params }: BlogPostProps) {
  const post = allBlogPosts.find((post) => {
    const postSlug = post.url.split("/").filter((s) => s && s !== "blog").join("/");
    const requestSlug = params.slug.join("/");
    return postSlug === requestSlug;
  });

  if (!post || post.published === false) {
    notFound();
  }

  const MDXContent = useMDXComponent(post.body.code);
  const components = useMDXComponents({});

  return (
    <>
      <BlogPostJsonLd
        title={post.title}
        description={post.description}
        date={post.date}
        url={`https://bengregory.com${post.url}`}
      />
      <article className="flex w-full min-h-screen justify-center pt-4 sm:pt-24 pb-12">
        <div className="w-[90%] max-w-[800px] space-y-8">
        <div className="space-y-4">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          {post.series && (
            <Badge variant="secondary" className="mb-2">
              {post.series}
            </Badge>
          )}
          
          <h1 className="text-4xl font-bold">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>
                {format(parseISO(post.date), "LLLL d, yyyy")}
              </time>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{Math.ceil(post.readingTime.minutes)} min read</span>
              </div>
            )}
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <MDXContent components={components} />
        </div>
        
        {post.series && (
          <div className="border-t pt-8 mt-12">
            <h3 className="text-lg font-semibold mb-4">More in this series</h3>
            <div className="space-y-2">
              {allBlogPosts
                .filter((p) => p.series === post.series && p.published !== false)
                .sort((a, b) => a.url.localeCompare(b.url))
                .map((p) => (
                  <Link
                    key={p.url}
                    href={p.url}
                    className={`block p-3 rounded-lg border transition-colors ${
                      p.url === post.url
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="font-medium">{p.title}</div>
                    <div className="text-sm text-muted-foreground">{p.description}</div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </article>
    </>
  );
}
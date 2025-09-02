import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import { allBlogPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on software engineering, product development, and technology. Read about building products, technical architecture, and reflections on the craft of coding.",
  openGraph: {
    title: "Blog | Ben Gregory",
    description: "Thoughts on software engineering, product development, and technology",
    type: "website",
    url: "https://bengregory.com/blog",
  },
};

export default function Blog() {
  // Sort posts by date (newest first) and filter out unpublished posts
  const posts = allBlogPosts
    .filter((post) => post.published !== false)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  // Get unique tags from all posts
  const uniqueTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  );

  // Group posts by series
  const seriesPosts = posts.reduce((acc, post) => {
    if (post.series) {
      if (!acc[post.series]) {
        acc[post.series] = [];
      }
      acc[post.series].push(post);
    }
    return acc;
  }, {} as Record<string, typeof posts>);

  return (
    <div className="flex w-full min-h-screen justify-center pt-4 sm:pt-24 pb-12">
      <div className="w-[90%] max-w-[800px] space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <div className="flex flex-wrap gap-2">
            {uniqueTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.url} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    {post.series && (
                      <Badge variant="secondary" className="mb-2">
                        {post.series}
                      </Badge>
                    )}
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      <Link href={post.url}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={post.url}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{Math.ceil(post.readingTime.minutes)} min read</span>
                      </div>
                    )}
                  </div>
                  {post.tags && (
                    <div className="flex gap-1">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Featured projects including AI-powered development platforms, comprehensive TV show AI systems, and real-time collaboration tools. Built with modern tech stacks.",
  openGraph: {
    title: "Projects | Ben Gregory",
    description: "Featured projects showcasing AI platforms, development tools, and innovative web applications",
    type: "website",
    url: "https://bengregory.com/projects",
  },
};

export default function Work() {
  let projects = [
    {
      project: "Kasava",
      site: "kasava.dev",
      link: "https://kasava.dev",
      summary:
        "AI-powered development workflow platform that revolutionizes how teams work by automatically synchronizing GitHub activities with task management systems, providing intelligent insights, and enabling natural language interactions.",
      categories: ["Backend", "Frontend", "AI/ML", "Extensions", "Integrations"],
      tech_stack: {
        "Backend": ["Cloudflare Workers", "Hono.js", "PostgreSQL", "Mastra AI"],
        "Frontend": ["Next.js 15", "React 19", "Tailwind CSS v4", "AI SDK"],
        "AI/ML": ["Anthropic Claude", "Voyage AI", "GraphCodeBERT"],
        "Extensions": ["Chrome Extension", "AI bug detection"],
        "Integrations": ["10+ task platforms", "Slack", "Teams", "Discord"],
        "Infrastructure": ["Cloudflare Edge", "Supabase", "Stripe"],
      },
    },
    {
      project: "Monroe",
      site: "joinmonroe.com",
      link: "https://joinmonroe.com",
      summary:
        "Comprehensive TV show AI platform leveraging machine learning to provide intelligent recommendations, content analysis, and user engagement features across web, mobile, and desktop platforms.",
      categories: ["Frontend", "Mobile", "Desktop", "API", "AI/ML", "SDKs"],
      tech_stack: {
        "Frontend": ["Next.js 15", "React 19", "TailwindCSS", "Jotai"],
        "Mobile": ["React Native", "Expo", "NativeWind"],
        "Desktop": ["Electron", "TypeScript"],
        "API": ["Hono", "TypeScript", "Drizzle ORM", "Redis"],
        "AI/ML": ["OpenAI", "Anthropic", "DistilBERT", "AutoGluon"],
        "SDKs": ["Node.js SDK", "Python SDK", "TypeScript support"],
        "Infrastructure": ["PostgreSQL", "Supabase Auth", "Stripe/Paddle"],
      },
    },
    {
      project: "Airflow Plugins",
      site: "github.com/airflow-plugins",
      link: "https://github.com/airflow-plugins/Example-Airflow-DAGs",
      summary:
        "Built and promoted collaborative open data community for Apache Foundation project " +
        "garnering code contributions from US, Germany, Ireland, Israel, South Korea, and Taiwan.",
      categories: ["Data Engineering", "Open Source"],
      tech_stack: {
        "Core": ["Python", "Apache Airflow", "Docker"],
      },
    },
  ];

  return (
    <div className="flex w-full min-h-screen justify-center pt-4 sm:pt-24 pb-12">
      <div className="w-[90%] max-w-[900px] space-y-6">
        {projects.map((item, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl">
                  {item.project}
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={item.link} target="_blank" className="flex items-center gap-2">
                    <span className="text-sm">{item.site}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription className="text-base mt-2">
                {item.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.categories && (
                <div className="flex flex-wrap gap-2">
                  {item.categories.map((category, catIdx) => (
                    <Badge key={catIdx} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="space-y-3">
                <p className="text-sm font-medium">Built with:</p>
                {Object.entries(item.tech_stack).map(([category, techs]) => (
                  <div key={category} className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">{category}:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {techs.map((tech: string, techIdx: number) => (
                        <Badge key={techIdx} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Code2, Rocket, BookOpen, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 sm:px-8">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero Section */}
        <section className="space-y-6 text-center sm:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ben Gregory
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
              Software Engineer & Product Builder
            </p>
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
            Building AI-powered platforms and innovative web applications. 
            Stanford MBA with expertise in full-stack development, product management, 
            and scaling startups.
          </p>

          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <Button asChild size="lg">
              <Link href="/projects">
                <Rocket className="mr-2 h-4 w-4" />
                View Projects
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/blog">
                <BookOpen className="mr-2 h-4 w-4" />
                Read Blog
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick Links Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/work" 
            className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-blue-500"
          >
            <Briefcase className="h-8 w-8 mb-3 text-blue-600" />
            <h3 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
              Work Experience
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              From founder to senior PM
            </p>
            <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
          </Link>

          <Link 
            href="/projects" 
            className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-purple-500"
          >
            <Code2 className="h-8 w-8 mb-3 text-purple-600" />
            <h3 className="font-semibold mb-1 group-hover:text-purple-600 transition-colors">
              Projects
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI platforms & web apps
            </p>
            <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600" />
          </Link>

          <Link 
            href="/blog" 
            className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-green-500"
          >
            <BookOpen className="h-8 w-8 mb-3 text-green-600" />
            <h3 className="font-semibold mb-1 group-hover:text-green-600 transition-colors">
              Blog
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tech insights & tutorials
            </p>
            <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-green-600" />
          </Link>

          <Link 
            href="/education" 
            className="group p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all hover:border-orange-500"
          >
            <svg 
              className="h-8 w-8 mb-3 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" 
              />
            </svg>
            <h3 className="font-semibold mb-1 group-hover:text-orange-600 transition-colors">
              Education
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stanford MBA & more
            </p>
            <ArrowRight className="h-4 w-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-orange-600" />
          </Link>
        </section>

        {/* Featured Projects Preview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">Kasava</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                AI-powered development workflow platform with GitHub sync and intelligent insights
              </p>
              <Link href="/projects" className="text-blue-600 hover:underline text-sm flex items-center">
                Learn more <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">Monroe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Comprehensive TV show AI platform - the Goodreads for television
              </p>
              <Link href="/projects" className="text-blue-600 hover:underline text-sm flex items-center">
                Learn more <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

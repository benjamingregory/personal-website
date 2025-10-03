import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Experience",
  description:
    "Professional experience as a software engineer and product manager. From founding startups to leading teams at scale-ups and established companies.",
  openGraph: {
    title: "Work Experience | Ben Gregory",
    description:
      "Professional experience as a software engineer and product manager",
    type: "website",
    url: "https://bengregory.com/work",
  },
};

export default function Work() {
  let work = [
    {
      role: "Founder",
      company: "Kasava",
      year: "2025",
      link: "https://kasava.dev",
      summary:
        "Building an AI-powered development workflow platform focused on GitHub integration and intelligent document processing. \
        Kasava provides seamless GitHub repository analysis, AI-powered chat interactions, Google Docs integration, and Chrome extension-based bug detection.",
      key_projects: [
        "Built backend with Cloudflare Workers, Hono.js, and PostgreSQL with pgvector for semantic search",
        "Implemented multi-stage queue pipeline architecture for parallel repository indexing (10-30 files/second processing)",
        "Integrated Mastra framework for AI workflow orchestration with Claude, Gemini, and Vertex AI",
        "Created AI-powered semantic commit analysis with type classification and impact assessment",
        "Developed Chrome extension for bug detection with video/screenshot recording and GitHub integration",
        "Built Next.js frontend with React 19, Tailwind CSS, and real-time streaming responses",
      ],
    },
    {
      role: "Founder",
      company: "Monroe",
      year: "2024-2025",
      link: "https://joinmonroe.com",
      summary:
        "Built a comprehensive TV show AI platform with microservices architecture, providing intelligent recommendations, content analysis, \
        and cross-platform user engagement. The Goodreads / Letterboxd for television.",
      key_projects: [
        "Built backend API with Hono, TypeScript, PostgreSQL/Drizzle, and Redis caching with comprehensive Jest test coverage",
        "Developed Next.js 15 frontend with React 19, Tailwind CSS, Radix UI, and Jotai state management with Vitest testing",
        "Created React Native mobile app with Expo for iOS and Android with offline capabilities and push notifications",
        "Built Electron desktop app for Windows, macOS, and Linux with system tray integration",
        "Developed Node.js and Python SDKs with TypeScript-first design and comprehensive test coverage",
        "Implemented AI/ML pipeline with fine-tuned DistilBERT models, AutoGluon, OpenAI GPT, and Anthropic Claude",
        "Built automated web scraping system for entertainment news from 10+ major outlets with article classification",
        "Integrated Supabase Auth, Stripe/Paddle billing, and TMDB API for metadata",
      ],
    },
    {
      role: "Senior Product Manager (Freight)",
      company: "Deliverr → Shopify → Flexport",
      year: "2022-2023",
      link: "https://flexport.com",
      summary:
        "Joined Deliverr at the Series E stage to build out the domestic Freight product and\
        grew it to $15MM ARR over two years. " +
        "The company was acquired by Shopify in 2022 to form Shopify Logistics. " +
        "This division was acquired by Flexport in 2023.",
      key_projects: [
        "Launched pallet labels and custom scanning app for tracking across distribution warehouses",
        "Launched quoting tool for Growth team, reducing response time for customer quote requests from 24 hours to 10 seconds",
        "Launched Freight app with Deliverr’s Seller Portal, transitioning 65% of active customers to self-serve model and growing automated bookings by 40% over three months",
      ],
    },
    {
      role: "Product Management Intern",
      company: "Gusto",
      year: "2021-2021",
      link: "https://deliverr.com",
      key_projects: [
        "Launched in-app control of Tax-Advantaged Accounts product, identifying technical requirements, creating wireframes, and leading team through four milestones in three month period",
        "Evaluated expansion opportunity into Property & Casualty Insurance, modeling opportunity size under different company growth rates and market trends and providing detailed recommendations with key metrics",
      ],
    },
    {
      role: "MBA Student Associate",
      company: "Activision Blizzard",
      year: "2020-2020",
      link: "https://www.activisionblizzard.com",
      key_projects: [
        "Ran technical product management pilot for internal platform supporting 125MM MAU, working with team of engineers to develop six new product features based on user interviews and creating a roadmap based on new user-centric prioritization framework",
        "Forecasted migration costs from private data center to Google Cloud Platform and presented findings to COO",
      ],
    },
    {
      role: "Senior Product Manager (Founding Team)",
      company: "Astronomer",
      year: "2015-2019",
      link: "https://www.astronomer.io",
      key_projects: [
        "Led eight-person customer team distributed across US, Poland, and India to successfully implement platform for global e-commerce division of Fortune 50 consumer goods brand",
        "Built and promoted collaborative open data community for Apache Foundation project, garnering code contributions from US, Germany, Ireland, Israel, South Korea, and Taiwan: https://github.com/airflow-plugins",
        "Maintained 100% customer retention through first year as customer-facing team member, including three months of accelerated prototyping while in Angelpad (#1 on MIT U.S. Seed Accelerator Rankings)",
      ],
    },
  ];

  return (
    <div className="flex w-full h-screen overflow-scroll scrollbar-hide justify-center pt-4 sm:pt-24">
      <div className="max-w-[600px] w-[80%] space-y-6 flex flex-col divide-y-2 item-between">
        {work.map((experience, idx) => (
          <div key={idx} className="pt-6 space-y-3">
            <div className="leading-5">
              <div className="text-lg font-bold">{experience.role}</div>
              <div className="hover:font-bold ">
                <Link href={experience.link} target="_blank">
                  {experience.company}
                </Link>
                &nbsp;({experience.year})
              </div>
            </div>
            <div className="leading-5">{experience.summary}</div>
            <ul className="list-disc pl-6 space-y-1">
              {experience.key_projects.map((i, idx) => (
                <li className="leading-5" key={idx}>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Work() {
  let work = [
    {
      role: "Founder / Solo Dev",
      company: "Monroe",
      year: "2024-2025",
      link: "https://joinmonroe.com",
      summary:
        "Starting with the challenge of building an app end-to-end by myself,\
        I built Monroe, the Goodreads / Letterboxd for television.",
      key_projects: [
        "Wrote 80k lines of code",
        "Built responsive web app with Next.js, Typescript, Tailwind",
        "Built API w/ Express, Prisma, Node and then rebuilt in Hono, Dribble, and Deno",
        "Built AI Service w/ Python, TS, PGVector, and OpenAI, powering article classification, transcription, chat interface, and\
        recommendation engine",
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

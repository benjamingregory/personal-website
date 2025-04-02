import Link from "next/link";

export default function Work() {
  let education = [
    {
      project: "Monroe",
      site: "joinmonroe.com",
      link: "https://joinmonroe.com",
      summary:
        "Monroe is your pop culture companion. It's a platform for fans to track your favorite tv shows.",
      tech_stack: [
        "App: React, Next.js, TypeScript, TailwindCSS",
        "API: Deno, Drizzle, Hono, Docker",
        "AI: Python, Typescript, OpenAI",
        "DB: Postgres, Redis, ChromaDB",
        "Data: Pandas, BeautifulSoup, Cron",
        "Infrastructure: Vercel, Railway",
      ],
    },
    // {
    //   project: "Pendri",
    //   site: "usependri.com",
    //   link: "https://pendri-next-auth.vercel.app/",
    //   summary:
    //     "Pendri is a podcast platform that was including transcriptions before it was cool.",
    //   hosted: ["Vercel", "AWS"],

    //   tech_stack: "React, Next.js, TypeScript, TailwindCSS",
    // },
    {
      project: "Airflow Plugins",
      site: "github.com/airflow-plugins",
      link: "https://github.com/airflow-plugins/Example-Airflow-DAGs",
      summary:
        "Built and promoted collaborative open data community for Apache Foundation project " +
        "garnering code contributions from US, Germany, Ireland, Israel, South Korea, and Taiwan.",
      tech_stack: ["Python, Apache Airflow, Docker"],
    },
  ];

  return (
    <div className="flex w-full h-screen w-full justify-center pt-4 sm:pt-24">
      <div className="w-[80%] max-w-[600px] space-y-6 flex flex-col divide-y-[1px] item-between">
        {education.map((item, idx) => (
          <div key={idx} className="pt-6">
            <div className="items-center flex">
              <span className="text-xl font-semibold">
                {item.project.toUpperCase()}
              </span>
              &nbsp;-&nbsp;
              <span className="hover:font-bold text-sm">
                <Link href={item.link} target="_blank">
                  {item.site}
                </Link>
              </span>
            </div>
            <div className="leading-5">{item.summary}</div>
            <div className="pt-4">
              Built with:
              {item.tech_stack.map((i, idx) => (
                <p className="pl-4" key={idx}>
                  {i}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Work() {
  let education = [
    {
      role: "Senior Product Manager (Freight)",
      company: "Deliverr → Shopify → Flexport",
      year: "2022-2023",
      link: "https://flexport.com",
      summary:
        "Joined Deliverr at the Series E stage to build out the Freight product. " +
        "The company was acquired by Shopify in 2022 and then Shopify was acquired by Flexport in 2023.",

      key_projects: [
        "Launched quoting tool for Growth team, reducing response time for customer quote requests from 24 hours to 10 seconds. ",
        "Launched Freight app with Deliverr’s Seller Portal, transitioning 65% of active customers to self-serve model and growing automated bookings by 40% over three months",
      ],
    },
    {
      role: "Product Management Intern",
      company: "Gusto",
      year: "2022-2022",
      link: "https://deliverr.com",
      key_projects: ["Aasdf", "asdf", "asdf"],
    },
    {
      role: "MBA Student Associate",
      company: "Activision Blizzard",
      year: "2020-2020",
      link: "https://www.activisionblizzard.com",
      key_projects: ["Aasdf", "asdf", "asdf"],
    },
    {
      role: "Senior Product Manager (Founding Team)",
      company: "Astronomer",
      year: "2015-2019",
      link: "https://www.astronomer.io",
      key_projects: ["Aasdf", "asdf", "asdf"],
    },
  ];

  return (
    <div className="flex w-full justify-center pt-12">
      <div className="w-[600px] space-y-6 flex flex-col divide-y-2 item-between">
        {education.map((item, idx) => (
          <div key={idx} className="pt-6 space-y-3">
            <div className="leading-5">
              <div className="text-lg font-bold">{item.role}</div>
              <div className="hover:font-bold ">
                <Link href={item.link} target="_blank">
                  {item.company}
                </Link>
                &nbsp;({item.year})
              </div>
            </div>
            <div className="leading-5 text-justify">{item.summary}</div>
            <ul className="list-disc pl-6 space-y-1">
              {item.key_projects.map((i, idx) => (
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

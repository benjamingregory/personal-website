import Link from "next/link";

export default function Education() {
  let education = [
    {
      degree: "MBA",
      school: "Stanford Graduate School of Business",
      year: "2019-2021",
      award: "USA Fellow (Full Scholarship)",
      link: "https://www.gsb.stanford.edu",
    },
    {
      degree: "Fellow",
      school: "Venture for America",
      year: "2013-2015",
      award: "2nd Class of Fellows",
      link: "https://ventureforamerica.org",
    },
    {
      degree: "BA, Economics",
      school: "Washington University in St. Louis",
      year: "2009-2013",
      award: "Magna Cum Laude",
      link: "https://economics.wustl.edu",
    },
  ];

  return (
    <div className="flex w-full h-screen w-full justify-center pt-24">
      <div className="w-[600px] space-y-6 flex flex-col divide-y-2 item-between">
        {education.map((item, idx) => (
          <div key={idx} className="pt-6">
            <div className="flex items-center">
              <span className="font-bold text-lg">{item.degree}</span>
              <span className="text-sm">&nbsp;-&nbsp;{item.award}</span>
            </div>
            <div className="hover:font-bold">
              <Link href={item.link} target="_blank">
                {item.school}
              </Link>
            </div>
            <div>{item.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

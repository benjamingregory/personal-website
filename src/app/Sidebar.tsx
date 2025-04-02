"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  let sections = [
    {
      name: "Work",
      href: "/work",
    },
    {
      name: "Education",
      href: "/education",
    },
    {
      name: "Projects",
      href: "/projects",
    },
    {
      name: "Blog",
      href: "/blog",
    },
  ];

  let params = usePathname();
  let currentSection = params.split("/")[1];

  return (
    <div className="min-w-[140px] sm:w-[240px] border-r-2 border-gray-200 justify-between flex flex-col h-[100vh]">
      <div className="flex pt-2 flex-col items-start justify-start space-y-2">
        <Link href="/">
          <div className="pl-4">Ben Gregory</div>
        </Link>
        <div className="border-b-[1px] w-full border-gray-200" />
        <div className="flex flex-col items-end space-y-2 pt-4 w-full pr-4">
          {sections.map((section, idx) => (
            <Link
              key={idx}
              className="hover:font-bold transition-all ease-in-out duration-200"
              prefetch={true}
              href={section.href}
            >
              <span
                className={
                  currentSection === section.name.toLowerCase()
                    ? "font-bold"
                    : ""
                }
              >
                {section.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div className="hidden pb-6 sm:flex justify-center">
        Made with ♥ by Me
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";

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
    <nav className="min-w-[140px] sm:w-[240px] border-r-2 border-gray-200 dark:border-gray-700 justify-between flex flex-col h-[100vh]" aria-label="Main navigation">
      <div className="flex pt-2 flex-col items-start justify-start space-y-2">
        <div className="flex justify-between items-center w-full px-4">
          <Link href="/" aria-label="Go to homepage">
            <div>Ben Gregory</div>
          </Link>
          <DarkModeToggle />
        </div>
        <div className="border-b-[1px] w-full border-gray-200 dark:border-gray-700" role="separator" />
        <ul className="flex flex-col items-end space-y-2 pt-4 w-full pr-4" role="list">
          {sections.map((section, idx) => (
            <li key={idx} role="listitem">
              <Link
                className="hover:font-bold transition-all ease-in-out duration-200"
                prefetch={true}
                href={section.href}
                aria-label={`Navigate to ${section.name} section`}
                aria-current={currentSection === section.name.toLowerCase() ? "page" : undefined}
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
            </li>
          ))}
        </ul>
      </div>
      <div className="hidden pb-6 sm:flex justify-center" aria-label="Footer">
        Made with ♥ by Me
      </div>
    </nav>
  );
}

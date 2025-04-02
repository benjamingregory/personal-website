import Link from "next/link";

export default function Footer() {
  return (
    <div className="w-full hidden h-[60px] bg-white sm:flex justify-end pr-8">
      <div className="flex h-full items-center text-sm space-x-2">
        <div>benjaminrgregory at gmail dot com</div>
        <div>·</div>
        <div>
          <Link
            className="hover:font-bold"
            href="https://github.com/benjamingregory"
            target="_blank"
          >
            Github
          </Link>
        </div>
        <div>·</div>
        <div>
          <Link
            className="hover:font-bold"
            href="https://www.linkedin.com/in/benjamin-gregory"
            target="_blank"
          >
            Linkedin
          </Link>
        </div>
      </div>
    </div>
  );
}

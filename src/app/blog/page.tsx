import Link from "next/link";

export default function Blog() {
  const data = [
    {
      title: "Building Monroe...........Part I, The Start",
      date: "2025-03-10",
      href: "/blog/building_monroe/part_1",
    },
    {
      title: "Building Monroe...........Part II, The Tech Stack",
      date: "2025-03-10",
      href: "/blog/building_monroe/part_2",
    },
    {
      title: "Building Monroe...........Part III, Features and Reflections",
      date: "2025-03-10",
      href: "/blog/building_monroe/part_3",
    },
    // {
    //   title:
    //     "Building Monroe...........Part IV, Building with AI and Product Managing Yourself",
    //   date: "2025-03-10",
    //   href: "/blog/building_monroe/part_4",
    // },
    // {
    //   title: "Building Monroe...........Part V, Features and Reflections",
    //   date: "2025-03-10",
    //   href: "/blog/building_monroe/part_5",
    // },
    {
      title: "GDC 2025 Spotlight: Coplay",
      date: "2025-03-25",
      href: "/blog/gdc_coplay",
    },
    // {
    //   title: "An exploration of pen plotting",
    //   date: "2025-03-10",
    //   href: "/blog/pen_plotting",
    // },
  ];

  function BlogList({
    data,
  }: {
    data: { title: string; date: string; href: string }[];
  }): JSX.Element {
    return (
      <ul className="space-y-4">
        {data.map((post) => {
          return (
            <li key={post.href} className=" flex-col flex">
              <Link
                className="hover:font-bold text-gray-800 text-lg"
                href={post.href}
              >
                {post.title}
              </Link>
              <p className="text-gray-400 text-sm">Published on {post.date}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex w-full flex-col h-screen pl-4 sm:pl-16 pt-24">
      <div className="text-xl font-bold pb-2">Posts</div>
      <BlogList data={data} />
    </div>
  );
}

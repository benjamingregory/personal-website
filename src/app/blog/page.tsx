import Link from "next/link";

export default function Blog() {
  const data = [
    {
      title: "Building Cover...........Part I, The Start",
      date: "2024-07-08",
      href: "/blog/building_cover/part_1",
    },
    // {
    //   title: "Building Cover...........Part II, The Tech Stack",
    //   date: "2024-07-08",
    //   href: "/blog/building_cover/part_2",
    // },
    // {
    //   title: "Building Cover...........Part III, Features and Reflections",
    //   date: "2024-07-08",
    //   href: "/blog/building_cover/part_3",
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
              <p className="text-gray-400">Published on {post.date}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex w-full flex-col h-screen pl-16 pt-24">
      <div className="text-xl font-bold pb-2">Posts</div>
      <BlogList data={data} />
    </div>
  );
}

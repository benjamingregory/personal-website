import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1 style={{ fontSize: "64px" }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ fontSize: "36px" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontSize: "24px" }}>{children}</h3>,
    h4: ({ children }) => (
      <h4 style={{ fontSize: "20px italic" }}>{children}</h4>
    ),
    ul: (props: any) => <ul className="text-sm list-disc" {...props} />,
    p: (props: any) => <p className="text-xs sm:text-[13px]" {...props} />,
    a: (props: any) => <a className="font-bold " {...props} />,
    img: (props: any) => (
      <span className="flex justify-center">
        <Image alt="image" width={400} height={400} {...props} />
      </span>
    ),
    ...components,
  };
}

import type { MDXComponents } from "mdx/types";
import Image from "next/image";

export const mdxComponents: MDXComponents = {
  img: (props: any) => {
    const altText = props.alt || "";
    const isDecorative = !altText;
    return (
      <Image
        alt={altText}
        width={800}
        height={600}
        {...props}
        role={isDecorative ? "presentation" : undefined}
        aria-hidden={isDecorative ? "true" : undefined}
        className="my-6 inline-block h-auto w-full max-w-full rounded-lg border border-border/60"
      />
    );
  },
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}

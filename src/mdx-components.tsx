import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { slugify } from "@/lib/toc";

function nodeToText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeToText(
      (node as { props?: { children?: unknown } }).props?.children,
    );
  }
  return "";
}

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
  h2: ({ children, ...props }: any) => {
    const id = slugify(nodeToText(children));
    return (
      <h2 id={id} className="scroll-mt-24" {...props}>
        {children}
      </h2>
    );
  },
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}

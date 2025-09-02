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
    ul: (props: any) => (
      <ul
        style={{
          fontSize: "14px",
          listStyleType: "disc",
          fontStyle: "italic",
        }}
        className="pl-4"
        {...props}
      />
    ),
    p: (props: any) => <p style={{ fontSize: "14px" }} {...props} />,
    a: (props: any) => <a className="font-bold " {...props} />,
    img: (props: any) => {
      // Ensure alt text is provided, fallback to empty string for decorative images
      const altText = props.alt || "";
      const isDecorative = !altText;
      
      return (
        <figure className="flex flex-col items-center my-4">
          <span className="flex justify-center">
            <Image 
              alt={altText} 
              width={400} 
              height={400} 
              {...props}
              // Mark decorative images appropriately for screen readers
              role={isDecorative ? "presentation" : undefined}
              aria-hidden={isDecorative ? "true" : undefined}
            />
          </span>
          {/* Optional: Add caption support if title attribute is provided */}
          {props.title && (
            <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              {props.title}
            </figcaption>
          )}
        </figure>
      );
    },
    ...components,
  };
}

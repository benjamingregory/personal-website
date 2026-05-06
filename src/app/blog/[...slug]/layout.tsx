import ReadingProgress from "@/components/motion/ReadingProgress";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReadingProgress />
      {children}
    </>
  );
}

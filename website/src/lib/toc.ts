export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(
  content: string,
): { id: string; label: string }[] {
  const headings: { id: string; label: string }[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^##\s+(.+?)\s*#*\s*$/.exec(trimmed);
    if (!match) continue;

    const label = match[1].replace(/[*_`]/g, "").trim();
    const id = slugify(label);
    if (!id) continue;

    headings.push({ id, label });
  }
  return headings;
}

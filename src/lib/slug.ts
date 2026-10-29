export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function csvToList(value: string) {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function listToCsv(values: string[] | undefined) {
  return (values ?? []).join(", ");
}

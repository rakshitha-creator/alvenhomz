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

/** For content where commas are meaningful (for example project highlights). */
export function linesToList(value: string) {
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function listToLines(values: string[] | undefined) {
  return (values ?? []).join("\n");
}

/** Browser confirmation before adding or removing images/videos in admin. */
export function confirmMediaChange(
  action: "add" | "remove" | "replace",
  kind: "image" | "video" | "images" = "image",
) {
  const label = kind === "images" ? "images" : kind;
  const messages: Record<typeof action, string> = {
    add: `Upload this ${label} to Firebase Storage?`,
    remove: `Remove this ${label}? It will be deleted from Storage when applicable.`,
    replace: `Replace the current ${label}? The previous file will be removed from Storage.`,
  };
  return window.confirm(messages[action]);
}

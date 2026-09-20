export type LayerKind = "experience" | "book" | "world" | "collection";

export type LayerSelection = {
  kind: LayerKind;
  slug: string;
};

export function layerHref({ kind, slug }: LayerSelection) {
  return `/?layer=${kind}&slug=${encodeURIComponent(slug)}`;
}

export function canonicalHref({ kind, slug }: LayerSelection) {
  return `/${kind}/${encodeURIComponent(slug)}`;
}

export function parseLayerSearch(search: string): LayerSelection | null {
  const params = new URLSearchParams(search);
  const kind = params.get("layer");
  const slug = params.get("slug");
  if (!slug || !["experience", "book", "world", "collection"].includes(kind ?? "")) return null;
  return { kind: kind as LayerKind, slug };
}

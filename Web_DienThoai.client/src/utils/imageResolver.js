const DEFAULT_FALLBACK = "https://placehold.co/600x600?text=No+Image";

export const resolveImage = (img, fallback = DEFAULT_FALLBACK) => {
  if (!img) return fallback;

  if (img.startsWith("http")) return img;

  return img;
};

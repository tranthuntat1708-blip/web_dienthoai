const BLOG_IMAGE_MAP = {
  "danh-gia-iphone-16-pro-max": "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-geo-240909_inline.jpg.large.jpg",
  "top-tablet-cho-sinh-vien": "https://www.apple.com/newsroom/images/2024/05/apple-unveils-the-redesigned-11-inch-and-all-new-13-inch-ipad-air-with-m2/article/Apple-iPad-Air-hero-240507_big.jpg.large.jpg",
};

export function getMappedBlogImage(slug, currentImage) {
  if (!slug) return currentImage;

  const mappedImage = BLOG_IMAGE_MAP[slug];
  if (!mappedImage) return currentImage;

  const isPlaceholder =
    !currentImage ||
    currentImage.includes("placehold.co") ||
    currentImage.includes("No+Image");

  return isPlaceholder ? mappedImage : currentImage;
}

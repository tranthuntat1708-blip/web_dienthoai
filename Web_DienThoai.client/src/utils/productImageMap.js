const APPLE_IPHONE_GALLERY = [
  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1695635646343-4f1a0e2dbe98?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
];

const TABLET_GALLERY = [
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=1200&q=80",
];

const AUDIO_GALLERY = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
];

const SAMSUNG_PHONE_GALLERY = [
  "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80",
];

const XIAOMI_PHONE_GALLERY = [
  "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1200&q=80",
];

const OPPO_PHONE_GALLERY = [
  "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583573636246-18cb2246697f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1200&q=80",
];

const WATCH_GALLERY = [
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=1200&q=80",
];

const ACCESSORY_GALLERY = [
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1615526675159-e248c3021d3f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1609592806596-b43f0f0b0cf5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1200&q=80",
];

const slugGalleryMap = {};

function assignGallery(slugs, gallery) {
  slugs.forEach((slug) => {
    slugGalleryMap[slug] = gallery;
  });
}

assignGallery(
  [
    "iphone-16-pro-max-256gb",
    "iphone-16-pro-128gb",
    "iphone-16-pro-512gb",
    "iphone-16-128gb",
    "iphone-16-plus-256gb",
    "iphone-15-pro-max-256gb",
    "iphone-15-128gb",
    "iphone-14-128gb",
    "iphone-13-128gb",
    "iphone-12-64gb-cu-dep-99",
  ],
  APPLE_IPHONE_GALLERY,
);

assignGallery(
  [
    "ipad-pro-m4-11-v2024",
    "ipad-air-m2-11-128gb",
    "ipad-gen-10-64gb",
    "ipad-mini-7-128gb",
    "galaxy-tab-s9-256gb",
    "xiaomi-pad-6-128gb",
  ],
  TABLET_GALLERY,
);

assignGallery(
  [
    "airpods-pro-gen-2-usb-c",
    "airpods-4-anc",
    "sony-wh-1000xm5",
    "marshall-minor-iv",
    "jbl-live-beam-3",
    "samsung-galaxy-buds3-pro",
  ],
  AUDIO_GALLERY,
);

assignGallery(
  [
    "apple-watch-series-10-gps-46mm",
    "apple-watch-ultra-2",
    "galaxy-watch7-44mm",
    "xiaomi-watch-2-pro",
  ],
  WATCH_GALLERY,
);

assignGallery(
  [
    "samsung-galaxy-s24-ultra-512gb",
    "samsung-galaxy-s24-256gb",
    "samsung-galaxy-s24-plus-256gb",
    "samsung-galaxy-z-fold6-256gb",
    "samsung-galaxy-z-flip6-256gb",
    "samsung-galaxy-a55-256gb",
    "samsung-galaxy-a35-128gb",
    "samsung-galaxy-s23-fe-256gb",
    "galaxy-z-fold6-thom-browne-edition",
  ],
  SAMSUNG_PHONE_GALLERY,
);

assignGallery(
  [
    "xiaomi-14-ultra-256gb",
    "xiaomi-14-12gb-512gb",
    "redmi-note-13-pro-plus-256gb",
    "xiaomi-13t-pro-512gb",
    "poco-x6-pro-512gb",
    "redmi-13-256gb",
    "xiaomi-14t-pro-512gb",
  ],
  XIAOMI_PHONE_GALLERY,
);

assignGallery(
  [
    "oppo-find-x8-512gb",
    "oppo-reno12-pro-256gb",
    "oppo-reno11-f-256gb",
    "oppo-a79-256gb",
    "oppo-find-n3-flip-256gb",
  ],
  OPPO_PHONE_GALLERY,
);

assignGallery(
  [
    "cu-sac-apple-usb-c-20w",
    "sac-anker-737-120w",
    "cap-baseus-usb-c-100w",
    "anker-powerbank-20000mah-30w",
  ],
  ACCESSORY_GALLERY,
);

function isPlaceholderImage(url) {
  return !url || url.includes("placehold.co") || url.includes("No+Image");
}

export function getMappedProductImages(slug, currentImages = [], currentMainImage) {
  const usableImages = (currentImages ?? []).filter((url) => !isPlaceholderImage(url));

  if (!isPlaceholderImage(currentMainImage)) {
    usableImages.unshift(currentMainImage);
  }

  const dedupedUsableImages = [...new Set(usableImages)];
  if (dedupedUsableImages.length >= 3) {
    return dedupedUsableImages.slice(0, 4);
  }

  const fallbackGallery = slugGalleryMap[slug] ?? [];
  return [...new Set([...dedupedUsableImages, ...fallbackGallery])].slice(0, 4);
}

export function getMappedProductImage(slug, currentImage) {
  const gallery = getMappedProductImages(slug, [], currentImage);
  return gallery[0] ?? currentImage;
}

function hashString(value = "") {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 360;
  }
  return hash;
}

function hsl(hue, saturation, lightness) {
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function getBrandHue(brand = "", productType = "phone") {
  const normalizedBrand = brand.toLowerCase();
  const brandHueMap = {
    iphone: 218,
    apple: 218,
    samsung: 215,
    xiaomi: 28,
    oppo: 145,
    jbl: 18,
    sony: 270,
    marshall: 42,
    anker: 205,
    baseus: 198,
  };

  if (brandHueMap[normalizedBrand] !== undefined) {
    return brandHueMap[normalizedBrand];
  }

  const typeHueMap = {
    phone: 220,
    tablet: 205,
    audio: 328,
    watch: 188,
    accessory: 34,
  };

  return typeHueMap[productType] ?? 220;
}

function getProductTypeLabel(productType = "phone") {
  const labels = {
    phone: "Điện thoại",
    tablet: "Tablet",
    audio: "Âm thanh",
    watch: "Đồng hồ",
    accessory: "Phụ kiện",
  };

  return labels[productType] ?? "Sản phẩm";
}

function buildDeviceMarkup(productType, hue, frameIndex) {
  const accent = hsl(hue, 82, 58);
  const accentSoft = hsl((hue + 18) % 360, 90, 72);
  const shadow = hsl(hue, 35, 18);

  if (productType === "tablet") {
    return `
      <rect x="150" y="92" width="420" height="272" rx="30" fill="${shadow}" opacity="0.16" />
      <rect x="138" y="80" width="420" height="272" rx="30" fill="#0f172a" />
      <rect x="160" y="100" width="376" height="232" rx="20" fill="url(#screen${frameIndex})" />
      <circle cx="348" cy="344" r="4" fill="${accentSoft}" opacity="0.9" />
    `;
  }

  if (productType === "audio") {
    return `
      <rect x="208" y="244" width="280" height="92" rx="40" fill="#0f172a" />
      <rect x="222" y="258" width="252" height="64" rx="32" fill="url(#screen${frameIndex})" />
      <rect x="218" y="104" width="58" height="138" rx="28" fill="#0f172a" />
      <rect x="420" y="104" width="58" height="138" rx="28" fill="#0f172a" />
      <rect x="233" y="118" width="28" height="112" rx="14" fill="${accent}" />
      <rect x="435" y="118" width="28" height="112" rx="14" fill="${accentSoft}" />
    `;
  }

  if (productType === "watch") {
    return `
      <rect x="278" y="46" width="84" height="420" rx="30" fill="${accent}" opacity="0.42" />
      <rect x="206" y="128" width="228" height="228" rx="56" fill="#0f172a" />
      <rect x="228" y="150" width="184" height="184" rx="42" fill="url(#screen${frameIndex})" />
      <circle cx="412" cy="242" r="14" fill="${accentSoft}" opacity="0.86" />
    `;
  }

  if (productType === "accessory") {
    return `
      <rect x="204" y="124" width="176" height="236" rx="36" fill="#0f172a" />
      <rect x="226" y="146" width="132" height="192" rx="24" fill="url(#screen${frameIndex})" />
      <rect x="372" y="170" width="56" height="86" rx="18" fill="${accent}" />
      <path d="M428 214 C474 214 494 248 494 292" stroke="${accentSoft}" stroke-width="16" fill="none" stroke-linecap="round" />
      <rect x="482" y="286" width="32" height="46" rx="12" fill="${accentSoft}" />
    `;
  }

  return `
    <rect x="220" y="52" width="200" height="420" rx="48" fill="#0f172a" />
    <rect x="238" y="74" width="164" height="376" rx="34" fill="url(#screen${frameIndex})" />
    <rect x="288" y="88" width="64" height="10" rx="5" fill="#cbd5e1" opacity="0.55" />
    <circle cx="320" cy="427" r="12" fill="${accentSoft}" opacity="0.8" />
  `;
}

function buildMockImage({ slug, title, brand, color, productType, frameLabel, frameIndex }) {
  const baseHue = (getBrandHue(brand, productType) + hashString(slug) + frameIndex * 17) % 360;
  const bg = hsl(baseHue, 90, 97);
  const panel = hsl((baseHue + 10) % 360, 88, 94);
  const accent = hsl(baseHue, 82, 58);
  const accentSoft = hsl((baseHue + 22) % 360, 88, 74);
  const titleSafe = (title || "TechStore").slice(0, 34);
  const badge = color || brand || getProductTypeLabel(productType);
  const subtitle = `${getProductTypeLabel(productType)} • ${frameLabel}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 720" role="img" aria-label="${titleSafe}">
      <defs>
        <linearGradient id="bg${frameIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="100%" stop-color="${panel}" />
        </linearGradient>
        <linearGradient id="screen${frameIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accentSoft}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="720" height="720" rx="48" fill="url(#bg${frameIndex})" />
      <circle cx="112" cy="108" r="86" fill="${accentSoft}" opacity="0.28" />
      <circle cx="632" cy="598" r="118" fill="${accent}" opacity="0.12" />
      <rect x="48" y="48" width="624" height="624" rx="42" fill="#ffffff" opacity="0.88" />
      <text x="88" y="112" fill="#2563eb" font-size="26" font-weight="700" font-family="Be Vietnam Pro, Arial, sans-serif">TechStore</text>
      <text x="88" y="150" fill="#475569" font-size="22" font-family="Be Vietnam Pro, Arial, sans-serif">${subtitle}</text>
      <text x="88" y="542" fill="#0f172a" font-size="34" font-weight="700" font-family="Be Vietnam Pro, Arial, sans-serif">${titleSafe}</text>
      <text x="88" y="582" fill="#475569" font-size="22" font-family="Be Vietnam Pro, Arial, sans-serif">${badge}</text>
      <rect x="88" y="606" width="172" height="44" rx="22" fill="${accent}" />
      <text x="174" y="635" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="700" font-family="Be Vietnam Pro, Arial, sans-serif">${frameLabel}</text>
      ${buildDeviceMarkup(productType, baseHue, frameIndex)}
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildGeneratedGallery(product = {}) {
  const slug = product?.slug || product?.name || "san-pham";
  const title = product?.name || "Sản phẩm";
  const productType = product?.productType || "phone";
  const frames = ["Mặt trước", "Mặt sau", "Thiết kế", "Chi tiết"];

  return frames.map((frameLabel, frameIndex) =>
    buildMockImage({
      slug,
      title,
      brand: product?.brand,
      color: product?.color,
      productType,
      frameLabel,
      frameIndex,
    }),
  );
}

function isPlaceholderImage(url) {
  return !url || url.includes("placehold.co") || url.includes("No+Image");
}

export function getMappedProductImages(slug, currentImages = [], currentMainImage, product = {}) {
  const usableImages = (currentImages ?? []).filter((url) => !isPlaceholderImage(url));

  if (!isPlaceholderImage(currentMainImage)) {
    usableImages.unshift(currentMainImage);
  }

  const dedupedUsableImages = [...new Set(usableImages)];
  const generatedGallery = buildGeneratedGallery({ ...product, slug });

  return [...new Set([...dedupedUsableImages, ...generatedGallery])].slice(0, 4);
}

export function getMappedProductImage(slug, currentImage, product = {}) {
  const gallery = getMappedProductImages(slug, [], currentImage, product);
  return gallery[0] ?? currentImage;
}

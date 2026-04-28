// src/api/products.ts
import apiClient from "./client";
import { getMappedProductImage, getMappedProductImages } from "../utils/productPhotoMapReal";

function normalizeText(value) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function detectBrand(text) {
  const brands = [
    "iPhone",
    "Samsung",
    "Xiaomi",
    "Oppo",
    "Vivo",
    "Realme",
    "Nokia",
    "Honor",
    "OnePlus",
    "Google",
    "Huawei",
  ];

  const lowerText = text.toLowerCase();
  return brands.find((brand) => lowerText.includes(brand.toLowerCase())) ?? null;
}

function detectProductType(product, text) {
  const categorySource = normalizeText(
    `${product?.category?.name ?? ""} ${product?.category?.slug ?? ""} ${product?.name ?? ""}`,
  ).toLowerCase();

  if (categorySource.includes("tai nghe") || categorySource.includes("airpods") || text.includes("tai nghe")) {
    return "audio";
  }

  if (categorySource.includes("ipad") || categorySource.includes("tablet") || text.includes("máy tính bảng")) {
    return "tablet";
  }

  if (categorySource.includes("watch") || categorySource.includes("đồng hồ")) {
    return "watch";
  }

  if (categorySource.includes("phụ kiện") || categorySource.includes("cáp") || categorySource.includes("sạc")) {
    return "accessory";
  }

  return "phone";
}

function extractStorage(text) {
  const match = text.match(/\b((?:1\s*tb|512|256|128|64|32)\s*(?:tb|gb))\b/i);
  if (!match) return null;

  return match[1].replace(/\s+/g, "").toUpperCase();
}

function extractRam(text) {
  const match = text.match(/\b(24|16|12|8|6|4|3)\s*gb(?:\s*ram)?\b/i);
  return match ? `${match[1]}GB` : null;
}

function extractCamera(text) {
  const matches = [...text.matchAll(/\b(\d{2,3})\s*mp\b/gi)];
  if (!matches.length) return null;

  const highest = Math.max(...matches.map((match) => Number(match[1])));
  return `${highest}MP`;
}

function extractBattery(text) {
  const match = text.match(/\b(\d{4,5})\s*mah\b/i);
  return match ? `${match[1]}mAh` : null;
}

function extractScreen(text) {
  const match = text.match(/\b(\d(?:[.,]\d{1,2})?)\s*(?:[\"”]|inch|inches)\b/i);
  return match ? `${match[1].replace(",", ".")}"` : null;
}

function extractChip(text) {
  const match = text.match(/\b(A\d{1,2}\s?(?:Pro|Bionic)?|M\d|Snapdragon\s?[\w\s+]+|Dimensity\s?\d+|Exynos\s?\d+)\b/i);
  return match ? normalizeText(match[1]) : null;
}

function extractCharging(text) {
  const match = text.match(/\b(\d{2,3})\s*w\b/i);
  return match ? `${match[1]}W` : null;
}

function extractConnectivity(text) {
  const values = [];

  if (/\b5g\b/i.test(text)) values.push("5G");
  if (/\bwi-?fi\b/i.test(text)) values.push("Wi-Fi");
  if (/\busb-c\b/i.test(text)) values.push("USB-C");
  if (/\bbluetooth\b/i.test(text)) values.push("Bluetooth");
  if (/\bmagsafe\b/i.test(text)) values.push("MagSafe");

  return values.length ? values.join(", ") : null;
}

function extractNoiseCanceling(text) {
  const match = text.match(/(chống ồn[^,.]+)/i);
  return match ? normalizeText(match[1]) : null;
}

function extractAudioFeature(text) {
  const match = text.match(/(âm thanh[^,.]+)/i);
  return match ? normalizeText(match[1]) : null;
}

function extractChargingCase(text) {
  const match = text.match(/(hộp sạc[^,.]+)/i);
  return match ? normalizeText(match[1]) : null;
}

function extractTechSpecs(product) {
  const source = normalizeText(
    [
      product?.name,
      product?.description,
      product?.shortDescription,
      product?.material,
      product?.style,
    ]
      .filter(Boolean)
      .join(" "),
  );
  const productType = detectProductType(product, source.toLowerCase());
  const chip = product?.chip ?? extractChip(source);
  const charging = product?.charging ?? extractCharging(source);
  const connectivity = product?.connectivity ?? extractConnectivity(source);
  const noiseCanceling = product?.noiseCanceling ?? extractNoiseCanceling(source);
  const audioFeature = product?.audioFeature ?? extractAudioFeature(source);
  const chargingCase = product?.chargingCase ?? extractChargingCase(source);

  return {
    productType,
    brand: product?.brand ?? detectBrand(source),
    ram: product?.ram ?? extractRam(source),
    storage: product?.storage ?? extractStorage(source),
    camera: product?.camera ?? extractCamera(source),
    battery: product?.battery ?? extractBattery(source),
    screen: product?.screen ?? extractScreen(source),
    chip,
    charging,
    connectivity,
    noiseCanceling,
    audioFeature,
    chargingCase,
  };
}

function buildFeatureBadges(product) {
  const candidatesByType = {
    phone: [
      product.brand,
      product.ram && `RAM ${product.ram}`,
      product.storage,
      product.camera && `Camera ${product.camera}`,
      product.battery && `Pin ${product.battery}`,
      product.screen && `Màn ${product.screen}`,
      product.charging && `Sạc ${product.charging}`,
    ],
    tablet: [
      product.brand,
      product.screen && `Màn ${product.screen}`,
      product.storage,
      product.chip && `Chip ${product.chip}`,
      product.connectivity,
    ],
    audio: [
      product.connectivity,
      product.noiseCanceling,
      product.audioFeature,
      product.chargingCase,
      product.color && `Màu ${product.color}`,
    ],
    watch: [
      product.screen && `Màn ${product.screen}`,
      product.battery && `Pin ${product.battery}`,
      product.connectivity,
      product.color && `Màu ${product.color}`,
    ],
    accessory: [
      product.connectivity,
      product.charging && `Công suất ${product.charging}`,
      product.material,
      product.color && `Màu ${product.color}`,
    ],
  };

  return (candidatesByType[product.productType] ?? candidatesByType.phone)
    .filter(Boolean)
    .slice(0, 4);
}

function buildHighlightSpecs(product) {
  const byType = {
    phone: [
      { label: "Chip", value: product.chip },
      { label: "Màn hình", value: product.screen },
      { label: "Camera", value: product.camera },
      { label: "Pin", value: product.battery },
      { label: "Sạc", value: product.charging },
      { label: "Kết nối", value: product.connectivity },
      { label: "RAM", value: product.ram },
      { label: "Bộ nhớ", value: product.storage },
    ],
    tablet: [
      { label: "Chip", value: product.chip },
      { label: "Màn hình", value: product.screen },
      { label: "Bộ nhớ", value: product.storage },
      { label: "Kết nối", value: product.connectivity },
      { label: "Khối lượng", value: product.weightKg ? `${product.weightKg} kg` : null },
    ],
    audio: [
      { label: "Kết nối", value: product.connectivity },
      { label: "Chống ồn", value: product.noiseCanceling },
      { label: "Âm thanh", value: product.audioFeature },
      { label: "Hộp sạc", value: product.chargingCase },
    ],
    watch: [
      { label: "Màn hình", value: product.screen },
      { label: "Pin", value: product.battery },
      { label: "Kết nối", value: product.connectivity },
    ],
    accessory: [
      { label: "Kết nối", value: product.connectivity },
      { label: "Công suất", value: product.charging },
      { label: "Chất liệu", value: product.material },
    ],
  };

  return (byType[product.productType] ?? byType.phone).filter((item) => item.value);
}

function buildPromotion(product) {
  if (!product?.isOnSale || !product?.salePrice || !product?.price || product.salePrice >= product.price) {
    return null;
  }

  return {
    discount: Math.round((1 - product.salePrice / product.price) * 100),
  };
}

function normalizeProduct(product) {
  const specs = extractTechSpecs(product);
  const existingImages = Array.isArray(product?.images)
    ? product.images
    : Array.isArray(product?.subImages)
      ? product.subImages.map((image) => image?.url).filter(Boolean)
      : [];
  const mappedImages = getMappedProductImages(
    product?.slug,
    existingImages,
    product?.mainImageUrl,
    { ...product, ...specs },
  );
  const mainImageUrl = getMappedProductImage(product?.slug, product?.mainImageUrl, {
    ...product,
    ...specs,
  });
  const images = mappedImages.length ? mappedImages : mainImageUrl ? [mainImageUrl] : [];
  const subImages = images.slice(1).map((url, index) => ({
    id: index + 1,
    url,
    altText: `${product?.name ?? "Sản phẩm"} - ảnh ${index + 2}`,
    sortOrder: index + 1,
  }));

  return {
    ...product,
    ...specs,
    mainImageUrl: images[0] ?? mainImageUrl,
    images,
    subImages,
    rating: product?.rating ?? product?.averageRating ?? 0,
    reviews: product?.reviews ?? product?.reviewCount ?? 0,
    promotion: product?.promotion ?? buildPromotion(product),
    featureBadges: buildFeatureBadges({ ...product, ...specs }),
    highlightSpecs: buildHighlightSpecs({ ...product, ...specs }),
  };
}

export const productApi = {
  async getProducts(params = {}) {
    const response = await apiClient.get("/products", { params });
    const payload = response.data ?? {};
    const items = (payload.items ?? payload.Items ?? []).map(normalizeProduct);

    return {
      items,
      total: payload.total ?? payload.Total ?? items.length,
      page: payload.page ?? payload.Page ?? params.page ?? 1,
      pageSize: payload.pageSize ?? payload.PageSize ?? params.pageSize ?? items.length,
      data: items,
    };
  },

  async getProductBySlug(slug) {
    const response = await apiClient.get(`/products/${slug}`);
    return normalizeProduct(response.data);
  },
};

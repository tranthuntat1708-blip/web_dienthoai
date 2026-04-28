import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import ProductCard from "../components/product/ProductCardMinimal";
import { productApi } from "../api/products";
import { homeMerchandisingApi } from "../api/homeMerchandising";
import { defaultHomeMerchandising } from "../utils/homeMerchandising";

function SectionTitle({ title, cta, to }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
      {cta && to ? (
        <Link to={to} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}

export default function HomePageMinimal() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [merchandising, setMerchandising] = useState(defaultHomeMerchandising);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, merchRes] = await Promise.all([
          productApi.getProducts({ pageSize: 8 }),
          homeMerchandisingApi.getPublic(),
        ]);
        setProducts(productRes?.data || productRes?.items || []);
        setMerchandising({ ...defaultHomeMerchandising, ...(merchRes || {}) });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 py-10">
        <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-12 pt-4 animate-fade-up">
      <section className="rounded-3xl bg-slate-50 px-6 py-16 md:px-14 md:py-24">
        <div className="max-w-3xl space-y-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">TechStore</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
            {merchandising.heroTitle || "Mua sam cong nghe chinh hang theo trai nghiem toi gian hon."}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            {merchandising.heroDescription || "Moi thu tap trung vao dieu quan trong nhat: chon dung san pham voi thong tin ro rang."}
          </p>
          <Link
            to="/danh-muc"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Kham pha san pham
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle title="San pham noi bat" cta="Xem tat ca" to="/danh-muc" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${index * 45}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

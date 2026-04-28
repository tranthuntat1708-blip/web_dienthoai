import { useEffect, useState } from "react";
import { History, Megaphone, Rocket, Save } from "lucide-react";
import toast from "react-hot-toast";

import apiClient from "../../api/client";
import { homeMerchandisingApi } from "../../api/homeMerchandising";
import { defaultHomeMerchandising } from "../../utils/homeMerchandising";

const DEFAULT_SERVICE_CARD = { productId: "", description: "", theme: "blue" };

export default function AdminMerchandising() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({
    heroTitle: defaultHomeMerchandising.heroTitle,
    heroDescription: defaultHomeMerchandising.heroDescription,
    quickCategoryIds: ["", "", "", "", "", ""],
    serviceCards: [
      { ...DEFAULT_SERVICE_CARD, theme: "yellow" },
      { ...DEFAULT_SERVICE_CARD, theme: "emerald" },
      { ...DEFAULT_SERVICE_CARD, theme: "blue" },
    ],
    currentVersion: 0,
    publishedVersion: null,
    updatedAt: null,
    publishedAt: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, productRes, adminRes] = await Promise.all([
          apiClient.get("/categories"),
          apiClient.get("/products", { params: { pageSize: 120 } }),
          homeMerchandisingApi.getAdmin(),
        ]);

        const categoryItems = categoryRes.data ?? [];
        const productItems = productRes.data?.items ?? [];
        const adminData = adminRes ?? {};

        setCategories(categoryItems);
        setProducts(productItems);
        setVersions(adminData.versions ?? []);

        const current = adminData.current ?? {};
        const quick = (current.quickCollections ?? []).map((item) => String(item.categoryId));
        const service = (current.serviceCards ?? []).map((item) => ({
          productId: String(item.productId),
          description: item.description ?? "",
          theme: item.theme ?? "blue",
        }));

        while (quick.length < 6) quick.push("");
        while (service.length < 3) service.push({ ...DEFAULT_SERVICE_CARD });

        setForm((prev) => ({
          ...prev,
          heroTitle: current.heroTitle || prev.heroTitle,
          heroDescription: current.heroDescription || prev.heroDescription,
          quickCategoryIds: quick.slice(0, 6),
          serviceCards: service.slice(0, 3),
          currentVersion: current.currentVersion ?? 0,
          publishedVersion: current.publishedVersion ?? null,
          updatedAt: current.updatedAt ?? null,
          publishedAt: current.publishedAt ?? null,
        }));
      } catch {
        toast.error("Không tải được dữ liệu merchandising.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function updateHero(event) {
    const { name, value } = event.target;
    setForm((state) => ({ ...state, [name]: value }));
  }

  function updateQuickCategory(index, value) {
    setForm((state) => {
      const next = [...state.quickCategoryIds];
      next[index] = value;
      return { ...state, quickCategoryIds: next };
    });
  }

  function updateServiceCard(index, field, value) {
    setForm((state) => {
      const next = [...state.serviceCards];
      next[index] = { ...next[index], [field]: value };
      return { ...state, serviceCards: next };
    });
  }

  function buildDraftPayload() {
    const quickCategoryIds = form.quickCategoryIds
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    const serviceCards = form.serviceCards
      .map((item) => ({
        productId: Number(item.productId),
        description: (item.description ?? "").trim(),
        theme: item.theme || "blue",
      }))
      .filter((item) => Number.isInteger(item.productId) && item.productId > 0);

    return {
      heroTitle: form.heroTitle.trim(),
      heroDescription: form.heroDescription.trim(),
      quickCategoryIds,
      serviceCards,
    };
  }

  async function handleSaveDraft() {
    const payload = buildDraftPayload();
    if (!payload.heroTitle || !payload.heroDescription) {
      toast.error("Tiêu đề và mô tả hero là bắt buộc.");
      return;
    }

    setSaving(true);
    try {
      const response = await homeMerchandisingApi.saveDraft(payload);
      setVersions(response?.versions ?? []);
      setForm((state) => ({
        ...state,
        currentVersion: response?.current?.currentVersion ?? state.currentVersion,
        publishedVersion: response?.current?.publishedVersion ?? state.publishedVersion,
        updatedAt: response?.current?.updatedAt ?? state.updatedAt,
        publishedAt: response?.current?.publishedAt ?? state.publishedAt,
      }));
      toast.success("Đã lưu bản nháp merchandising.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể lưu bản nháp.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(versionId) {
    setPublishing(true);
    try {
      const response = await homeMerchandisingApi.publish(versionId);
      setVersions(response?.versions ?? []);
      setForm((state) => ({
        ...state,
        publishedVersion: response?.current?.publishedVersion ?? state.publishedVersion,
        publishedAt: response?.current?.publishedAt ?? state.publishedAt,
      }));
      toast.success("Đã xuất bản merchandising.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể xuất bản merchandising.");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Đang tải cấu hình merchandising...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Megaphone size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950">Homepage Merchandising</h1>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý bản nháp, xuất bản và lịch sử phiên bản cho trang chủ.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="btn-outline flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? "Đang lưu..." : "Lưu bản nháp"}
            </button>
            <button
              type="button"
              onClick={() => handlePublish()}
              disabled={publishing}
              className="btn-primary flex items-center gap-2"
            >
              <Rocket size={16} />
              {publishing ? "Đang xuất bản..." : "Xuất bản hiện tại"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Phiên bản hiện tại</p>
            <p className="mt-1 font-bold text-slate-900">v{form.currentVersion}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Phiên bản đã xuất bản</p>
            <p className="mt-1 font-bold text-slate-900">{form.publishedVersion ? `v${versions.find(v => v.id === form.publishedVersion)?.versionNumber ?? "?"}` : "Chưa xuất bản"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
            <p className="text-slate-500">Cập nhật lúc</p>
            <p className="mt-1 font-bold text-slate-900">{form.updatedAt ? new Date(form.updatedAt).toLocaleString("vi-VN") : "-"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Hero + Bộ sưu tập nhanh (theo danh mục)</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tiêu đề hero</label>
              <input name="heroTitle" value={form.heroTitle} onChange={updateHero} className="input" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mô tả hero</label>
              <textarea name="heroDescription" value={form.heroDescription} onChange={updateHero} rows={4} className="input min-h-28 resize-y" />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Bộ sưu tập nhanh</label>
              {form.quickCategoryIds.map((categoryId, index) => (
                <select
                  key={`quick-${index}`}
                  value={categoryId}
                  onChange={(event) => updateQuickCategory(index, event.target.value)}
                  className="input"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Thẻ dịch vụ (theo sản phẩm)</h2>

          <div className="mt-4 space-y-4">
            {form.serviceCards.map((card, index) => (
              <div key={`service-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Thẻ {index + 1}</p>
                <select
                  value={card.productId}
                  onChange={(event) => updateServiceCard(index, "productId", event.target.value)}
                  className="input"
                >
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <textarea
                  value={card.description}
                  onChange={(event) => updateServiceCard(index, "description", event.target.value)}
                  rows={2}
                  placeholder="Thông điệp ngắn cho thẻ này"
                  className="input mt-2 min-h-20 resize-y"
                />

                <select
                  value={card.theme}
                  onChange={(event) => updateServiceCard(index, "theme", event.target.value)}
                  className="input mt-2"
                >
                  <option value="yellow">Yellow</option>
                  <option value="emerald">Emerald</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <History size={18} className="text-slate-500" />
          <h2 className="text-lg font-black text-slate-950">Lịch sử phiên bản</h2>
        </div>

        <div className="space-y-2">
          {versions.map((version) => (
            <div key={version.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-semibold text-slate-900">v{version.versionNumber}</p>
                <p className="text-sm text-slate-500">{new Date(version.createdAt).toLocaleString("vi-VN")}</p>
              </div>

              <div className="flex items-center gap-2">
                {version.isPublished ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Đang xuất bản
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePublish(version.id)}
                    disabled={publishing}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Xuất bản phiên bản này
                  </button>
                )}
              </div>
            </div>
          ))}

          {versions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              Chưa có phiên bản nào. Hãy lưu bản nháp trước.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Layers3, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import apiClient from "../../api/client";

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  icon: "",
  sortOrder: 0,
  isActive: true,
  parentCategoryId: "",
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const rootCategories = useMemo(() => items.filter((item) => !item.parentCategoryId), [items]);

  function fetchCategories() {
    apiClient
      .get("/categories/admin")
      .then((response) => setItems(response.data ?? []))
      .catch(() => toast.error("Không tải được danh mục."));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      icon: item.icon ?? "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive !== false,
      parentCategoryId: item.parentCategoryId ?? "",
    });
    setModalOpen(true);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: type === "checkbox" ? checked : value };
      if (name === "name" && !editingId) next.slug = slugify(value);
      return next;
    });
  }

  async function handleSave() {
    const payload = {
      ...form,
      sortOrder: Number(form.sortOrder || 0),
      parentCategoryId: form.parentCategoryId ? Number(form.parentCategoryId) : null,
    };

    try {
      if (editingId) await apiClient.put(`/categories/${editingId}`, payload);
      else await apiClient.post("/categories", payload);

      toast.success(editingId ? "Đã cập nhật danh mục." : "Đã tạo danh mục.");
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể lưu danh mục.");
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Ẩn danh mục "${item.name}"?`)) return;

    try {
      await apiClient.delete(`/categories/${item.id}`);
      toast.success("Đã ẩn danh mục.");
      fetchCategories();
    } catch {
      toast.error("Không thể ẩn danh mục.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Quản lý category</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh mục cha/con, trạng thái hiển thị và thứ tự lên menu.
          </p>
        </div>

        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Thêm category
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {item.parentCategoryId ? "Danh mục con" : "Danh mục gốc"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {item.isActive ? "Đang hiển thị" : "Đã ẩn"}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-black text-slate-950">{item.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{item.slug}</p>
              </div>

              <div className="flex gap-1">
                <button type="button" onClick={() => openEdit(item)} className="rounded-full p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600">
                  <Pencil size={16} />
                </button>
                <button type="button" onClick={() => handleDelete(item)} className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
              {item.description || "Chưa có mô tả danh mục."}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sản phẩm</p>
                <p className="mt-1 text-lg font-black text-slate-950">{item.productCount}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sort order</p>
                <p className="mt-1 text-lg font-black text-slate-950">{item.sortOrder}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <div className="w-full max-w-2xl space-y-5 rounded-[2rem] bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Layers3 size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{editingId ? "Chỉnh sửa category" : "Tạo category mới"}</h2>
                <p className="text-sm text-slate-500">Giữ slug rõ nghĩa để URL và menu sạch hơn.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tên danh mục</label>
                <input name="name" value={form.name} onChange={handleChange} className="input" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Danh mục cha</label>
                <select name="parentCategoryId" value={form.parentCategoryId} onChange={handleChange} className="input">
                  <option value="">Không có</option>
                  {rootCategories.filter((item) => item.id !== editingId).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Thứ tự</label>
                <input name="sortOrder" type="number" value={form.sortOrder} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Icon</label>
                <input name="icon" value={form.icon} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ảnh</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mô tả</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input min-h-28 resize-y" />
              </div>
              <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 accent-blue-600" />
                Hiển thị trên storefront
              </label>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Hủy</button>
              <button type="button" onClick={handleSave} className="btn-primary flex-1">Lưu category</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

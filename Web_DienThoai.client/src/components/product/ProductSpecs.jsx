// src/components/product/ProductSpecs.jsx
// Bảng thông số kỹ thuật: Kích thước, Khối lượng, Chất liệu

/**
 * @param {{
 *   product?: import('../../types/product').ProductDetail,
 *   lengthCm?: number,
 *   widthCm?: number,
 *   heightCm?: number,
 *   weightKg?: number,
 *   material?: string,
 *   style?: string,
 *   color?: string,
 *   detailed?: boolean
 * }} props
 */
export default function ProductSpecs({ product, lengthCm, widthCm, heightCm, weightKg, material, style, color }) {
  // Accept either a product object or individual props
  const l  = product?.lengthCm  ?? lengthCm;
  const w  = product?.widthCm   ?? widthCm;
  const h  = product?.heightCm  ?? heightCm;
  const wk = product?.weightKg  ?? weightKg;
  const m  = product?.material  ?? material;
  const s  = product?.style     ?? style;
  const c  = product?.color     ?? color;
  const fallbackSpecs = [
    { label: 'Kích thước (D×R×C)', value: [l, w, h].every(Boolean) ? `${l} × ${w} × ${h} cm` : null },
    { label: 'Khối lượng', value: wk ? `${wk} kg` : null },
    { label: 'Chất liệu', value: m || null },
    { label: 'Phong cách', value: s || null },
    { label: 'Màu sắc', value: c || null },
  ];

  const specs = [...(product?.highlightSpecs ?? []), ...fallbackSpecs].filter(
    (item, index, arr) => item?.value && arr.findIndex((candidate) => candidate.label === item.label) === index,
  );

  if (!specs.length) {
    specs.push({ label: 'Thông tin', value: 'Đang cập nhật' });
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-amber-50 px-4 py-2 font-semibold text-gray-700">Thông số kỹ thuật</div>
      <table className="w-full text-sm">
        <tbody>
          {specs.map(({ label, value }) => (
            <tr key={label} className="border-t border-gray-100">
              <td className="px-4 py-2 text-gray-500 w-1/2">{label}</td>
              <td className="px-4 py-2 font-medium text-gray-800">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

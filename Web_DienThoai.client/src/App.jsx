import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerLayout from "./components/layout/CustomerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import RequireAdmin from "./components/auth/RequireAdmin";
import RequireAuth from "./components/auth/RequireAuth";
import RequireGuest from "./components/auth/RequireGuest";

import HomePage from "./pages/HomePageMinimal";
import ProductListPage from "./pages/ProductCatalogPageMinimal";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPagePremium";
import BlogPage from "./pages/BlogPagePro";
import BlogDetailPage from "./pages/BlogDetailPage";
import PolicyPage from "./pages/PolicyPagePremium";
import CollectionPage from "./pages/CollectionPagePro";
import WishlistPage from "./pages/WishlistPage";
import ContactPage from "./pages/ContactPagePro";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import VnPayReturnPage from "./pages/VnPayReturnPage";
import AppointmentPage from "./pages/AppointmentPage";
import AccountPage from "./pages/AccountPage";
import ComparePage from "./pages/ComparePage";
import GuestOrderLookupPage from "./pages/GuestOrderLookupPage";
import AfterSalesPage from "./pages/AfterSalesPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminMerchandising from "./pages/admin/AdminMerchandising";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/danh-muc" element={<ProductListPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/bo-suu-tap" element={<CollectionPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/checkout/vnpay-return" element={<VnPayReturnPage />} />
          <Route path="/dat-hang-thanh-cong" element={<OrderSuccessPage />} />
          <Route
            path="/don-hang/:id"
            element={
              <RequireAuth>
                <OrderDetailPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dang-nhap"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/dat-lich" element={<AppointmentPage />} />
          <Route path="/chinh-sach" element={<PolicyPage />} />
          <Route path="/chinh-sach/:type" element={<PolicyPage />} />
          <Route
            path="/tai-khoan"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />
          <Route path="/so-sanh" element={<ComparePage />} />
          <Route path="/tra-cuu-don-hang" element={<GuestOrderLookupPage />} />
          <Route path="/hau-mai" element={<AfterSalesPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route
            path="/yeu-thich"
            element={
              <RequireAuth>
                <WishlistPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="san-pham" element={<AdminProducts />} />
          <Route path="danh-muc" element={<AdminCategories />} />
          <Route path="trang-chu" element={<AdminMerchandising />} />
          <Route path="don-hang" element={<AdminOrders />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="danh-gia" element={<AdminReviews />} />
          <Route path="khuyen-mai" element={<AdminPromotions />} />
          <Route path="lich-hen" element={<AdminAppointments />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="flex h-screen flex-col items-center justify-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-gray-500">Không tìm thấy trang</p>
              <a href="/" className="mt-4 text-blue-500">
                Về trang chủ
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

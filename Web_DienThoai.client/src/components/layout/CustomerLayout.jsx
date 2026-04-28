// src/components/layout/CustomerLayout.jsx
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./HeaderMinimal";
import FooterPro from "./FooterPro";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#111827",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />

      <Header />

      {/* Main */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <FooterPro />
    </div>
  );
}

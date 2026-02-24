import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

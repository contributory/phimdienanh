"use client";

import { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { IcClapper } from "./components/icons";
import { FilmStrip } from "./components/ui";
import { HistoryProvider } from "./hooks/useHistory";
import ContinuePage from "./pages/ContinuePage";
import DetailPage from "./pages/DetailPage";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center">
      <FilmStrip className="mb-8 w-64" />
      <p className="font-display text-[110px] leading-none tracking-wide text-gold-500 drop-shadow-[0_0_40px_rgba(245,179,1,0.3)]">
        404
      </p>
      <h1 className="font-display mt-2 text-3xl tracking-wide text-fog-100">SUẤT CHIẾU KHÔNG TỒN TẠI</h1>
      <p className="mt-2 max-w-md text-sm text-fog-500">
        Đường dẫn bạn mở không khớp với bộ phim hay danh mục nào. Quay về trang chủ để tiếp tục nhé.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold-500 px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-ink-950 transition hover:bg-gold-400 active:scale-95"
      >
        <IcClapper className="h-4 w-4" /> Về trang chủ
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HistoryProvider>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/xem-tiep" element={<ContinuePage />} />
              <Route path="/danh-sach/:slug" element={<ListPage kind="danh-sach" />} />
              <Route path="/the-loai/:slug" element={<ListPage kind="the-loai" />} />
              <Route path="/quoc-gia/:slug" element={<ListPage kind="quoc-gia" />} />
              <Route path="/nam/:slug" element={<ListPage kind="nam" />} />
              <Route path="/tim-kiem" element={<ListPage kind="tim-kiem" />} />
              <Route path="/phim/:slug" element={<DetailPage />} />
              <Route path="/phim/:slug/tap/:tap" element={<DetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HistoryProvider>
    </BrowserRouter>
  );
}

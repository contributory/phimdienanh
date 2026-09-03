"use client";

import { Link } from "react-router-dom";
import { API_BASE, COUNTRIES, GENRES, LIST_TYPES } from "../lib/api";
import { FilmStrip } from "./ui";
import { IcClapper, IcSignal } from "./icons";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-800 bg-ink-900/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <FilmStrip className="mb-10 opacity-70" />
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold-500 text-ink-950">
                <IcClapper className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl tracking-[0.06em] text-fog-100">
                RẠP<span className="text-gold-400">·KK</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fog-500">
              Rạp phim mini chạy hoàn toàn trên trình duyệt, bọc lại bộ API công khai của{" "}
              <a
                href="https://kkphim.com/api-document"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-gold-400 underline decoration-gold-500/40 underline-offset-4 hover:text-gold-300"
              >
                kkphim.com/api-document
              </a>
              . Không backend, không đăng nhập — mở lên là xem.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-md border border-ink-700 bg-ink-950/60 px-3 py-2 text-xs font-semibold text-fog-300">
              <IcSignal className="h-4 w-4 text-gold-400" />
              <span className="break-all font-mono text-[11px]">{API_BASE}</span>
            </p>
          </div>

          <nav aria-label="Danh mục">
            <p className="font-display text-lg tracking-widest text-fog-100">DANH MỤC</p>
            <ul className="mt-3 space-y-2">
              {LIST_TYPES.map((t) => (
                <li key={t.slug}>
                  <Link to={`/danh-sach/${t.slug}`} className="text-sm text-fog-500 transition hover:text-gold-400">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Thể loại">
            <p className="font-display text-lg tracking-widest text-fog-100">THỂ LOẠI</p>
            <ul className="mt-3 space-y-2">
              {GENRES.slice(0, 7).map((g) => (
                <li key={g.slug}>
                  <Link to={`/the-loai/${g.slug}`} className="text-sm text-fog-500 transition hover:text-gold-400">
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Quốc gia">
            <p className="font-display text-lg tracking-widest text-fog-100">QUỐC GIA</p>
            <ul className="mt-3 space-y-2">
              {COUNTRIES.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <Link to={`/quoc-gia/${c.slug}`} className="text-sm text-fog-500 transition hover:text-gold-400">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-ink-800 pt-6 text-xs text-fog-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Rạp KK — dự án học tập. Toàn bộ dữ liệu & hình ảnh thuộc về KKPhim và các nhà
            phát hành.
          </p>
          <p className="font-mono text-[11px]">
            SPA thuần client · hash routing · export tĩnh như <span className="text-gold-500">next export</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

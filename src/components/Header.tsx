"use client";

import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { COUNTRIES, GENRES, LIST_TYPES, searchMovies } from "../lib/api";
import type { Movie } from "../lib/types";
import { imgUrl } from "../lib/utils";
import { IcChevronD, IcClapper, IcSearch, IcX } from "./icons";
import { Spinner } from "./ui";

function NavItem({ to, label, end }: { to: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative whitespace-nowrap py-1 text-sm font-semibold transition-colors after:absolute after:-bottom-[3px] after:left-0 after:h-[2px] after:rounded-full after:bg-gold-500 after:transition-all after:duration-300 ${
          isActive ? "text-gold-400 after:w-full" : "text-fog-300 after:w-0 hover:text-fog-100 hover:after:w-full"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

function Dropdown({ label, items, prefix }: { label: string; items: readonly { slug: string; name: string }[]; prefix: string }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [loc]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 py-1 text-sm font-semibold transition-colors ${open ? "text-gold-400" : "text-fog-300 hover:text-fog-100"}`}
        aria-expanded={open}
      >
        {label}
        <IcChevronD className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute left-1/2 top-full z-50 mt-2 w-52 -translate-x-1/2 origin-top rounded-lg border border-ink-700 bg-ink-900 p-2 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.9)] transition-all duration-200 ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {items.map((g) => (
          <Link
            key={g.slug}
            to={`${prefix}${g.slug}`}
            className="block rounded-md px-3 py-2 text-sm font-medium text-fog-300 transition hover:bg-ink-800 hover:text-gold-300"
          >
            {g.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchBox() {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [suggests, setSuggests] = useState<Movie[]>([]);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQ(""), [loc]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocus(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const kw = q.trim();
    if (kw.length < 2) {
      setSuggests([]);
      setBusy(false);
      return;
    }
    setBusy(true);
    const t = setTimeout(() => {
      searchMovies(kw, 1)
        .then((res) => setSuggests(res.data?.items?.slice(0, 5) ?? []))
        .catch(() => setSuggests([]))
        .finally(() => setBusy(false));
    }, 380);
    return () => clearTimeout(t);
  }, [q]);

  const goSearch = () => {
    const kw = q.trim();
    if (!kw) return;
    setFocus(false);
    nav(`/tim-kiem?keyword=${encodeURIComponent(kw)}`);
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    goSearch();
  };

  return (
    <div className="relative w-full max-w-[300px]" ref={boxRef}>
      <form onSubmit={submit} role="search">
        <div className="flex items-center gap-2 rounded-md border border-ink-700 bg-ink-900/80 px-3 transition-colors focus-within:border-gold-500/70">
          <IcSearch className="h-4 w-4 shrink-0 text-fog-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            placeholder="Tìm phim, diễn viên…"
            className="h-9 w-full bg-transparent text-sm text-fog-100 placeholder:text-fog-500 focus:outline-none"
            aria-label="Tìm kiếm phim"
          />
          {busy && <Spinner className="h-4 w-4 text-gold-400" />}
          {q && !busy && (
            <button type="button" onClick={() => setQ("")} aria-label="Xoá từ khoá" className="text-fog-500 hover:text-fog-100">
              <IcX className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {focus && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-ink-700 bg-ink-900 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.9)]">
          {!busy && suggests.length === 0 ? (
            <p className="px-4 py-4 text-sm text-fog-500">Không tìm thấy gợi ý nào cho "{q}".</p>
          ) : (
            suggests.map((m) => (
              <Link
                key={m.slug}
                to={`/phim/${m.slug}`}
                onClick={() => {
                  setFocus(false);
                  setQ("");
                }}
                className="flex items-center gap-3 px-3 py-2 transition hover:bg-ink-800"
              >
                <img
                  src={imgUrl(m.thumb_url)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-14 w-10 shrink-0 rounded object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-fog-100">{m.name}</span>
                  <span className="block text-xs text-fog-500">
                    {[m.year, m.lang, m.quality].filter(Boolean).join(" · ")}
                  </span>
                </span>
              </Link>
            ))
          )}
          {!busy && suggests.length > 0 && (
            <button
              type="button"
              onClick={goSearch}
              className="block w-full border-t border-ink-700 bg-ink-850 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-gold-400 transition hover:text-gold-300"
            >
              Xem tất cả kết quả cho "{q}" →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? "border-ink-700/80 bg-ink-950/90 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.9)] backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-ink-950/95 to-ink-950/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Trang chủ Rạp KK">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold-500 text-ink-950 shadow-[0_0_24px_rgba(245,179,1,0.4)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <IcClapper className="h-5 w-5" />
          </span>
          <span className="font-display text-[26px] leading-none tracking-[0.06em] text-fog-100">
            RẠP<span className="text-gold-400">·KK</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Điều hướng chính">
          <NavItem to="/" label="Trang chủ" end />
          {LIST_TYPES.slice(1).map((t) => (
            <NavItem key={t.slug} to={`/danh-sach/${t.slug}`} label={t.label} />
          ))}
          <Dropdown label="Thể loại" items={GENRES.slice(0, 10)} prefix="/the-loai/" />
          <Dropdown label="Quốc gia" items={COUNTRIES.slice(0, 8)} prefix="/quoc-gia/" />
        </nav>

        <div className="ml-auto hidden sm:block">
          <SearchBox />
        </div>
      </div>

      {/* hàng điều hướng mobile */}
      <div className="row-scroll flex items-center gap-4 overflow-x-auto border-t border-ink-800/70 px-4 py-2 md:hidden">
        <div className="sm:hidden">
          <SearchBox />
        </div>
        <NavItem to="/" label="Trang chủ" end />
        {LIST_TYPES.slice(1).map((t) => (
          <NavItem key={t.slug} to={`/danh-sach/${t.slug}`} label={t.label} />
        ))}
        {GENRES.slice(0, 6).map((g) => (
          <NavLink
            key={g.slug}
            to={`/the-loai/${g.slug}`}
            className={({ isActive }) =>
              `whitespace-nowrap py-1 text-sm font-semibold ${isActive ? "text-gold-400" : "text-fog-500"}`
            }
          >
            {g.name}
          </NavLink>
        ))}
      </div>
    </header>
  );
}

"use client";

import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { IcSearch } from "../components/icons";
import {
  EmptyState,
  ErrorState,
  GridSkeleton,
  Pagination,
  Reveal,
} from "../components/ui";
import {
  GENRES,
  LIST_TYPES,
  YEARS,
  getCountryList,
  getGenreList,
  getList,
  getYearList,
  searchMovies,
} from "../lib/api";
import { useFetch } from "../hooks/useFetch";
import { setDocTitle } from "../lib/utils";

type Kind = "danh-sach" | "the-loai" | "quoc-gia" | "nam" | "tim-kiem";

export default function ListPage({ kind }: { kind: Kind }) {
  const { slug } = useParams<{ slug: string }>();
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const keyword = (params.get("keyword") ?? "").trim();

  const key =
    kind === "tim-kiem"
      ? keyword
        ? `search:${keyword}:${page}`
        : null
      : `${kind}:${slug}:${page}`;

  const { data, loading, error, retry } = useFetch(key, () => {
    switch (kind) {
      case "danh-sach":
        return getList(slug!, page);
      case "the-loai":
        return getGenreList(slug!, page);
      case "quoc-gia":
        return getCountryList(slug!, page);
      case "nam":
        return getYearList(slug!, page);
      case "tim-kiem":
        return searchMovies(keyword, page);
    }
  });

  const items = data?.data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const title =
    kind === "tim-kiem"
      ? `Kết quả cho "${keyword}"`
      : kind === "danh-sach"
        ? (LIST_TYPES.find((t) => t.slug === slug)?.label ?? data?.data?.titlePage ?? "Danh sách")
        : kind === "nam"
          ? `Phim năm ${slug}`
          : (data?.data?.titlePage ?? slug ?? "");

  useEffect(() => setDocTitle(title), [title]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug, keyword, page]);

  const goPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    setParams(next);
  };

  const genreName = GENRES.find((g) => g.slug === slug)?.name;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-fog-500" aria-label="Breadcrumb">
        <Link to="/" className="transition hover:text-gold-400">Trang chủ</Link>
        <span>/</span>
        <span className="text-fog-300">{title}</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl tracking-wide text-fog-100 sm:text-6xl">
          {kind === "tim-kiem" ? (
            <>
              <IcSearch className="mr-3 inline h-9 w-9 text-gold-400 sm:h-12 sm:w-12" />
              {title}
            </>
          ) : (
            title
          )}
        </h1>
        {!loading && !error && kind !== "tim-kiem" && (
          <p className="text-sm font-semibold text-fog-500">
            {data?.pagination?.totalItems
              ? `${data.pagination.totalItems.toLocaleString("vi-VN")} phim · trang ${page}/${Math.max(totalPages, 1)}`
              : `trang ${page}/${Math.max(totalPages, 1)}`}
          </p>
        )}
      </header>

      {/* tabs danh mục */}
      {kind === "danh-sach" && (
        <div className="row-scroll mb-6 flex gap-2 overflow-x-auto pb-1">
          {LIST_TYPES.map((t) => (
            <Link
              key={t.slug}
              to={`/danh-sach/${t.slug}`}
              className={`shrink-0 rounded-md px-4 py-2 text-sm font-bold transition active:scale-95 ${
                t.slug === slug
                  ? "bg-gold-500 text-ink-950 shadow-[0_0_22px_rgba(245,179,1,0.3)]"
                  : "border border-ink-700 bg-ink-900 text-fog-300 hover:border-gold-500/50 hover:text-gold-400"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}

      {/* lọc theo năm cho thể loại / quốc gia */}
      {(kind === "the-loai" || kind === "quoc-gia") && (
        <div className="mb-7 flex flex-wrap items-center gap-2 rounded-lg border border-ink-800 bg-ink-900/50 px-4 py-3">
          <span className="mr-1 text-xs font-extrabold uppercase tracking-widest text-fog-500">Năm:</span>
          {YEARS.map((y) => (
            <Link
              key={y}
              to={`/nam/${y}`}
              className="rounded border border-ink-700 px-2.5 py-1 font-display text-base tracking-wider text-fog-300 transition hover:border-gold-500/60 hover:text-gold-400"
            >
              {y}
            </Link>
          ))}
          {genreName && (
            <span className="ml-auto hidden text-xs font-semibold text-fog-500 sm:block">
              Đang xem: <span className="text-gold-400">{genreName}</span>
            </span>
          )}
        </div>
      )}

      {kind === "tim-kiem" && !keyword ? (
        <EmptyState
          title="CHƯA CÓ TỪ KHOÁ"
          note="Gõ tên phim, diễn viên vào ô tìm kiếm phía trên để bắt đầu."
        />
      ) : loading ? (
        <GridSkeleton count={18} />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : items.length === 0 ? (
        <EmptyState
          title="KHÔNG CÓ PHIM NÀO"
          note="API trả về danh sách rỗng — thử trang khác, năm khác hoặc từ khoá khác nhé."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((m, i) => (
              <Reveal key={m.slug} delay={Math.min(i % 6, 5) * 50}>
                <MovieCard movie={m} />
              </Reveal>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={goPage} />
        </>
      )}
    </div>
  );
}

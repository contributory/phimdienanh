"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import {
  IcCalendar,
  IcClock,
  IcFilm,
  IcGlobe,
  IcPlay,
  IcTag,
  IcTv,
  IcUsers,
} from "../components/icons";
import { ErrorState, FilmStrip, Reveal, Spinner } from "../components/ui";
import { getGenreList, getMovieDetail } from "../lib/api";
import { useFetch } from "../hooks/useFetch";
import { useHistory } from "../hooks/useHistory";
import { imgUrl, setDocTitle, stripHtml, timeAgo } from "../lib/utils";

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-700 bg-ink-900 text-gold-400">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-fog-500">{label}</p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-fog-100">{value}</p>
      </div>
    </div>
  );
}

export default function DetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { entries, hasWatched } = useHistory();
  const [serverIdx, setServerIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const { data, loading, error, retry } = useFetch(
    slug ? `detail:${slug}` : null,
    () => getMovieDetail(slug!),
  );

  const item = data?.data?.item;
  const servers = useMemo(() => data?.data?.episodes ?? [], [data]);
  const server = servers[Math.min(serverIdx, Math.max(servers.length - 1, 0))];
  const episodes = server?.server_data ?? [];
  const genreSlug = item?.category?.[0]?.slug ?? null;

  const related = useFetch(
    genreSlug ? `rel:${genreSlug}` : null,
    () => getGenreList(genreSlug!, 1),
  );

  useEffect(() => setServerIdx(0), [slug]);
  useEffect(() => {
    if (item) setDocTitle(item.name);
  }, [item]);

  if (loading && !item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Spinner className="h-9 w-9 text-gold-500" />
        <p className="font-display text-2xl tracking-widest text-fog-500">ĐANG MỞ RẠP…</p>
      </div>
    );
  }
  if (error && !item) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <ErrorState message={error} onRetry={retry} />
      </div>
    );
  }
  if (!item) return null;

  const desc = stripHtml(item.content);
  const continueEntry = entries.find((e) => e.slug === item.slug);
  const firstEp = servers[0]?.server_data?.[0];
  const watchTo = continueEntry?.episodeSlug
    ? `/phim/${item.slug}/tap/${continueEntry.episodeSlug}`
    : firstEp
      ? `/phim/${item.slug}/tap/${firstEp.slug}`
      : null;

  return (
    <div>
      {/* phông nền */}
      <div className="relative overflow-hidden border-b border-ink-800">
        <img
          src={imgUrl(item.poster_url || item.thumb_url)}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/82 to-ink-950" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-fog-500" aria-label="Breadcrumb">
            <Link to="/" className="transition hover:text-gold-400">Trang chủ</Link>
            <span>/</span>
            <Link
              to={`/danh-sach/${item.type === "series" ? "phim-bo" : "phim-le"}`}
              className="transition hover:text-gold-400"
            >
              {item.type === "series" ? "Phim bộ" : "Phim lẻ"}
            </Link>
            <span>/</span>
            <span className="text-fog-300">{item.name}</span>
          </nav>

          <div className="flex flex-col gap-8 sm:flex-row">
            {/* poster */}
            <Reveal className="shrink-0">
              <div className="w-44 -rotate-1 overflow-hidden rounded-lg border-2 border-ink-700 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:rotate-0 sm:w-60">
                <img
                  src={imgUrl(item.thumb_url || item.poster_url)}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
            </Reveal>

            {/* thông tin */}
            <Reveal delay={80} className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                {item.quality && (
                  <span className="rounded bg-gold-500 px-2 py-1 text-ink-950">{item.quality}</span>
                )}
                {item.lang && <span className="rounded bg-ember-600 px-2 py-1 text-fog-100">{item.lang}</span>}
                <span className="rounded border border-fog-500/40 px-2 py-1 text-fog-300">
                  {item.type === "series" ? "Phim bộ" : "Phim lẻ"}
                </span>
                <span
                  className={`flex items-center gap-1.5 rounded border px-2 py-1 ${
                    item.status === "ongoing"
                      ? "border-ember-500/50 text-ember-400"
                      : "border-gold-500/50 text-gold-400"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${item.status === "ongoing" ? "blink bg-ember-500" : "bg-gold-500"}`} />
                  {item.status === "ongoing" ? "Đang cập nhật" : "Hoàn thành"}
                </span>
              </div>

              <h1 className="font-display mt-3 text-4xl leading-[0.95] tracking-wide text-fog-100 sm:text-6xl">
                {item.name}
              </h1>
              {item.origin_name && item.origin_name !== item.name && (
                <p className="font-display mt-2 text-xl tracking-[0.14em] text-fog-500">{item.origin_name}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {item.category?.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/the-loai/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 px-3 py-1 text-xs font-bold text-gold-300 transition hover:bg-gold-500 hover:text-ink-950"
                  >
                    <IcTag className="h-3 w-3" /> {c.name}
                  </Link>
                ))}
                {item.country?.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/quoc-gia/${c.slug}`}
                    className="rounded-full border border-ink-600 px-3 py-1 text-xs font-bold text-fog-300 transition hover:border-fog-300 hover:text-fog-100"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              {desc && (
                <div className="mt-4 max-w-3xl">
                  <p className={`text-sm leading-relaxed text-fog-300 ${expanded ? "" : "clamp-3"}`}>{desc}</p>
                  {desc.length > 220 && (
                    <button
                      onClick={() => setExpanded((v) => !v)}
                      className="mt-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 transition hover:text-gold-300"
                    >
                      {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                    </button>
                  )}
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Meta icon={<IcUsers className="h-4 w-4" />} label="Đạo diễn" value={item.director?.join(", ") || "—"} />
                <Meta icon={<IcUsers className="h-4 w-4" />} label="Diễn viên" value={item.actor?.join(", ") || "—"} />
                <Meta icon={<IcCalendar className="h-4 w-4" />} label="Năm phát hành" value={item.year} />
                <Meta icon={<IcClock className="h-4 w-4" />} label="Thời lượng" value={item.episode_time} />
                <Meta
                  icon={item.type === "series" ? <IcTv className="h-4 w-4" /> : <IcFilm className="h-4 w-4" />}
                  label="Số tập"
                  value={
                    item.type === "series"
                      ? `${item.episode_current ?? "?"}${item.episode_total ? ` / ${item.episode_total}` : ""} tập`
                      : "Phim lẻ"
                  }
                />
                <Meta
                  icon={<IcGlobe className="h-4 w-4" />}
                  label="Cập nhật"
                  value={timeAgo(item.modified?.time)}
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {watchTo ? (
                  <Link
                    to={watchTo}
                    className="group inline-flex items-center gap-2.5 rounded-md bg-gold-500 px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-ink-950 shadow-[0_0_30px_rgba(245,179,1,0.35)] transition hover:bg-gold-400 active:scale-95"
                  >
                    <IcPlay className="h-4 w-4 transition-transform group-hover:scale-125" />
                    {continueEntry?.episodeSlug ? `Xem tiếp ${continueEntry.episode ?? ""}` : "Xem phim"}
                  </Link>
                ) : (
                  <span className="rounded-md border border-ember-500/40 bg-ember-500/10 px-5 py-3 text-sm font-bold text-ember-400">
                    Phim chưa có nguồn phát
                  </span>
                )}
                {firstEp && (
                  <Link
                    to={`/phim/${item.slug}/tap/${firstEp.slug}`}
                    className="inline-flex items-center gap-2 rounded-md border border-fog-500/40 px-5 py-3 text-sm font-bold text-fog-100 transition hover:border-fog-100/70 hover:bg-ink-900 active:scale-95"
                  >
                    Xem từ đầu
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 pt-10 sm:px-6">
        {/* danh sách tập */}
        {servers.length > 0 && (
          <Reveal as="section">
            <h2 className="font-display flex items-baseline gap-3 text-3xl tracking-wide text-fog-100 sm:text-4xl">
              <span className="inline-block h-7 w-1.5 -skew-x-12 rounded-sm bg-gold-500 sm:h-8" />
              Danh sách tập
              <span className="font-display text-lg tracking-widest text-fog-500">({episodes.length})</span>
            </h2>

            {servers.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {servers.map((s, i) => (
                  <button
                    key={`${s.server_name}-${i}`}
                    onClick={() => setServerIdx(i)}
                    className={`rounded-md px-4 py-2 text-sm font-bold transition active:scale-95 ${
                      i === Math.min(serverIdx, servers.length - 1)
                        ? "bg-ember-600 text-fog-100 shadow-[0_0_20px_rgba(244,64,84,0.35)]"
                        : "border border-ink-700 bg-ink-900 text-fog-300 hover:border-ember-500/60 hover:text-ember-400"
                    }`}
                  >
                    {s.server_name || `Server ${i + 1}`} · {s.server_data?.length ?? 0}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12">
              {episodes.map((ep, i) => {
                const watched = hasWatched(item.slug, ep.slug);
                const label = ep.name && ep.name.length <= 14 ? ep.name : `Tập ${i + 1}`;
                return (
                  <Link
                    key={ep.slug}
                    to={`/phim/${item.slug}/tap/${ep.slug}`}
                    title={ep.name}
                    className={`relative flex items-center justify-center gap-1.5 rounded-md border px-2 py-2.5 text-center text-xs font-bold transition active:scale-95 ${
                      watched
                        ? "border-gold-500/50 bg-gold-500/10 text-gold-300"
                        : "border-ink-700 bg-ink-900 text-fog-300 hover:border-gold-500/60 hover:text-gold-400"
                    }`}
                  >
                    {watched && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />}
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-fog-500">
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-gold-500 align-middle" /> Chấm vàng = tập bạn đã
              xem (lưu cục bộ trên trình duyệt).
            </p>
          </Reveal>
        )}

        <Reveal>
          <FilmStrip />
        </Reveal>

        {/* phim cùng thể loại */}
        <MovieRow
          title={`Có thể bạn thích · ${item.category?.[0]?.name ?? "đề xuất"}`}
          to={genreSlug ? `/the-loai/${genreSlug}` : "/danh-sach/phim-moi-cap-nhat"}
          items={(related.data?.data?.items ?? []).filter((m) => m.slug !== item.slug).slice(0, 16)}
          loading={related.loading}
          error={related.error}
          accent="ember"
        />
      </div>
    </div>
  );
}

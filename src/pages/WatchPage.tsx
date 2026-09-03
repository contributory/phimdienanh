"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IcAlert,
  IcChevronL,
  IcChevronR,
  IcExternal,
  IcMonitor,
  IcPlay,
  IcSignal,
} from "../components/icons";
import { ErrorState, Reveal, Spinner } from "../components/ui";
import { getEpisode } from "../lib/api";
import { useFetch } from "../hooks/useFetch";
import { useHistory } from "../hooks/useHistory";
import { imgUrl, setDocTitle } from "../lib/utils";

type Mode = "embed" | "hls";

/* Trình phát HLS (m3u8) — nạp động hls.js để tách chunk riêng */
function HlsPlayer({ src, onFatal }: { src: string; onFatal: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: import("hls.js").default | null = null;
    let cancelled = false;
    (async () => {
      const { default: Hls } = await import("hls.js");
      if (cancelled || !video) return;
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) onFatal();
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        onFatal();
      }
    })().catch(() => onFatal());
    return () => {
      cancelled = true;
      hls?.destroy();
      video.removeAttribute("src");
    };
  }, [src, onFatal]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      playsInline
      className="h-full w-full bg-black"
    />
  );
}

export default function WatchPage() {
  const { slug, tap } = useParams<{ slug: string; tap: string }>();
  const nav = useNavigate();
  const { push } = useHistory();
  const [serverIdx, setServerIdx] = useState(0);
  const [mode, setMode] = useState<Mode>("embed");
  const [hlsFailed, setHlsFailed] = useState(false);

  const { data, loading, error, retry } = useFetch(
    slug && tap ? `ep:${slug}:${tap}` : null,
    () => getEpisode(slug!, tap!),
  );

  const item = data?.data?.item;
  const servers = useMemo(() => data?.data?.episodes ?? [], [data]);

  /* tập đang phát: ưu tiên đúng slug trong server được chọn, fallback toàn bộ */
  const activeIdx = Math.min(serverIdx, Math.max(servers.length - 1, 0));
  const activeServer = servers[activeIdx];
  const current =
    activeServer?.server_data?.find((e) => e.slug === tap) ??
    servers.flatMap((s) => s.server_data ?? []).find((e) => e.slug === tap) ??
    activeServer?.server_data?.[0];

  const eps = activeServer?.server_data ?? [];
  const curIdx = eps.findIndex((e) => e.slug === current?.slug);
  const prev = curIdx > 0 ? eps[curIdx - 1] : null;
  const next = curIdx >= 0 && curIdx < eps.length - 1 ? eps[curIdx + 1] : null;

  /* reset mode khi đổi tập / nguồn */
  useEffect(() => {
    setHlsFailed(false);
    if (current) setMode(current.link_embed ? "embed" : "hls");
  }, [current?.slug, current?.link_embed, current?.link_m3u8]);

  /* lưu lịch sử xem */
  useEffect(() => {
    if (item && current) {
      push({
        slug: item.slug,
        name: item.name,
        thumb: item.thumb_url || item.poster_url,
        episode: current.name,
        episodeSlug: current.slug,
      });
      setDocTitle(`${item.name} — ${current.name}`);
    }
  }, [item?.slug, current?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Spinner className="h-9 w-9 text-gold-500" />
        <p className="font-display text-2xl tracking-widest text-fog-500">ĐANG NẠP TẬP PHIM…</p>
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

  const useHls = mode === "hls" && !!current?.link_m3u8;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-fog-500" aria-label="Breadcrumb">
        <Link to="/" className="transition hover:text-gold-400">Trang chủ</Link>
        <span>/</span>
        <Link to={`/phim/${item.slug}`} className="max-w-[220px] truncate transition hover:text-gold-400 sm:max-w-md">
          {item.name}
        </Link>
        <span>/</span>
        <span className="text-gold-400">{current?.name ?? tap}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* ── Cột player ── */}
        <div className="min-w-0">
          <div className="overflow-hidden rounded-lg border border-ink-700 bg-black shadow-[0_30px_80px_-24px_rgba(0,0,0,0.95)]">
            {/* tiêu đề player */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-700 bg-ink-900/90 px-4 py-3">
              <div className="min-w-0">
                <p className="font-display truncate text-xl tracking-wide text-fog-100 sm:text-2xl">
                  {item.name}
                </p>
                <p className="text-xs font-bold text-gold-400">
                  {current?.name ?? "—"} · {activeServer?.server_name || "Server 1"}
                </p>
              </div>
              {current?.link_embed && (
                <a
                  href={current.link_embed}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-ink-600 px-3 py-1.5 text-xs font-bold text-fog-300 transition hover:border-gold-500/60 hover:text-gold-400"
                >
                  <IcExternal className="h-3.5 w-3.5" /> Mở nguồn riêng
                </a>
              )}
            </div>

            {/* màn hình */}
            <div className="relative aspect-video w-full bg-black">
              {!current ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <IcAlert className="h-10 w-10 text-ember-400" />
                  <p className="font-display text-2xl tracking-wide text-fog-100">TẬP NÀY CHƯA CÓ NGUỒN PHÁT</p>
                  <p className="max-w-sm text-sm text-fog-500">
                    Thử chọn server khác hoặc tập khác bên dưới — KKPhim đôi khi chưa kịp cập nhật nguồn.
                  </p>
                </div>
              ) : useHls && !hlsFailed && current.link_m3u8 ? (
                <HlsPlayer src={current.link_m3u8} onFatal={() => setHlsFailed(true)} />
              ) : current.link_embed ? (
                <iframe
                  key={current.link_embed}
                  src={current.link_embed}
                  title={`${item.name} — ${current.name}`}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <IcAlert className="h-10 w-10 text-ember-400" />
                  <p className="font-display text-2xl tracking-wide text-fog-100">THIẾU NGUỒN PHÁT</p>
                  <p className="max-w-sm text-sm text-fog-500">Tập này không có link embed lẫn m3u8.</p>
                </div>
              )}
              {useHls && hlsFailed && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-ember-600/95 px-4 py-2.5 text-xs font-bold text-fog-100">
                  <span>Luồng HLS lỗi (có thể do CORS) — đã tự chuyển sang nguồn embed.</span>
                  {current?.link_embed && (
                    <button onClick={() => setMode("embed")} className="shrink-0 underline underline-offset-2">
                      Chuyển ngay
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* thanh điều khiển nguồn */}
            <div className="flex flex-wrap items-center gap-2 border-t border-ink-700 bg-ink-900/90 px-4 py-3">
              <span className="mr-1 text-[11px] font-extrabold uppercase tracking-widest text-fog-500">Server</span>
              {servers.map((s, i) => (
                <button
                  key={`${s.server_name}-${i}`}
                  onClick={() => setServerIdx(i)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                    i === activeIdx
                      ? "bg-gold-500 text-ink-950"
                      : "border border-ink-700 bg-ink-950 text-fog-300 hover:border-gold-500/60 hover:text-gold-400"
                  }`}
                >
                  {s.server_name || `Server ${i + 1}`}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setMode("embed");
                    setHlsFailed(false);
                  }}
                  disabled={!current?.link_embed}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-30 ${
                    !useHls
                      ? "bg-ink-700 text-gold-300"
                      : "border border-ink-700 text-fog-500 hover:text-fog-100"
                  }`}
                >
                  <IcMonitor className="h-3.5 w-3.5" /> Embed
                </button>
                <button
                  onClick={() => setMode("hls")}
                  disabled={!current?.link_m3u8}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-30 ${
                    useHls
                      ? "bg-ink-700 text-gold-300"
                      : "border border-ink-700 text-fog-500 hover:text-fog-100"
                  }`}
                >
                  <IcSignal className="h-3.5 w-3.5" /> M3U8
                </button>
              </div>
            </div>
          </div>

          {/* prev / next */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => prev && nav(`/phim/${item.slug}/tap/${prev.slug}`)}
              disabled={!prev}
              className="inline-flex items-center gap-2 rounded-md border border-ink-700 bg-ink-900 px-4 py-2.5 text-sm font-bold text-fog-300 transition enabled:hover:border-gold-500/60 enabled:hover:text-gold-400 enabled:active:scale-95 disabled:opacity-30"
            >
              <IcChevronL className="h-4 w-4" /> Tập trước
            </button>
            {next ? (
              <Link
                to={`/phim/${item.slug}/tap/${next.slug}`}
                className="group inline-flex items-center gap-2 rounded-md bg-gold-500 px-5 py-2.5 text-sm font-extrabold uppercase tracking-wide text-ink-950 shadow-[0_0_26px_rgba(245,179,1,0.3)] transition hover:bg-gold-400 active:scale-95"
              >
                <IcPlay className="h-4 w-4 transition-transform group-hover:scale-125" />
                Tập tiếp · {next.name}
              </Link>
            ) : (
              <span className="rounded-md border border-ink-700 px-4 py-2.5 text-sm font-bold text-fog-500">
                Đã hết tập trên server này
              </span>
            )}
            <Link
              to={`/phim/${item.slug}`}
              className="ml-auto text-sm font-semibold text-fog-500 underline decoration-ink-600 underline-offset-4 transition hover:text-gold-400"
            >
              Về trang phim
            </Link>
          </div>

          {/* mô tả ngắn */}
          <Reveal className="mt-8">
            <h2 className="font-display text-2xl tracking-wide text-fog-100">Nội dung phim</h2>
            <p className="clamp-3 mt-2 max-w-3xl text-sm leading-relaxed text-fog-300">
              {(() => {
                const div = document.createElement("div");
                div.innerHTML = item.content ?? "";
                return (div.textContent || "").replace(/\s+/g, " ").trim() || "Chưa có mô tả.";
              })()}
            </p>
          </Reveal>
        </div>

        {/* ── Cột danh sách tập ── */}
        <aside className="min-w-0">
          <div className="rounded-lg border border-ink-700 bg-ink-900/70">
            <div className="flex items-center justify-between border-b border-ink-700 px-4 py-3">
              <p className="font-display text-xl tracking-wide text-fog-100">Các tập phim</p>
              <span className="rounded bg-ink-800 px-2 py-1 font-display text-sm tracking-widest text-gold-400">
                {eps.length}
              </span>
            </div>
            <div className="max-h-[520px] overflow-y-auto p-2.5">
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-3">
                {eps.map((ep, i) => {
                  const active = ep.slug === current?.slug;
                  const label = ep.name && ep.name.length <= 12 ? ep.name : `Tập ${i + 1}`;
                  return (
                    <Link
                      key={ep.slug}
                      to={`/phim/${item.slug}/tap/${ep.slug}`}
                      title={ep.name}
                      className={`relative flex items-center justify-center rounded border px-1.5 py-2 text-center text-[11px] font-bold transition active:scale-95 ${
                        active
                          ? "border-gold-500 bg-gold-500 text-ink-950 shadow-[0_0_16px_rgba(245,179,1,0.4)]"
                          : "border-ink-700 bg-ink-950/70 text-fog-300 hover:border-gold-500/60 hover:text-gold-400"
                      }`}
                    >
                      {active && <IcPlay className="mr-1 h-2.5 w-2.5 shrink-0" />}
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>
              {eps.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-fog-500">Server này chưa có tập nào.</p>
              )}
            </div>
          </div>

          {/* thẻ phim */}
          <Link
            to={`/phim/${item.slug}`}
            className="group mt-4 flex gap-3 rounded-lg border border-ink-700 bg-ink-900/70 p-3 transition hover:border-gold-500/50"
          >
            <img
              src={imgUrl(item.thumb_url)}
              alt=""
              referrerPolicy="no-referrer"
              className="h-24 w-16 shrink-0 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-fog-500">Đang xem</p>
              <p className="mt-0.5 line-clamp-2 text-sm font-bold text-fog-100 group-hover:text-gold-300">
                {item.name}
              </p>
              <p className="mt-1 text-xs text-fog-500">
                {[item.year, item.lang, item.quality].filter(Boolean).join(" · ")}
              </p>
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
}

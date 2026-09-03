"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import Hero, { Ticker } from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { IcHistory, IcPlay, IcTrash } from "../components/icons";
import { FilmStrip, Reveal, SectionHead } from "../components/ui";
import { getList } from "../lib/api";
import { useFetch } from "../hooks/useFetch";
import { useHistory } from "../hooks/useHistory";
import type { HistoryEntry } from "../lib/types";
import { imgUrl, setDocTitle, timeAgo } from "../lib/utils";

function HistoryCard({ e }: { e: HistoryEntry }) {
  return (
    <Link
      to={`/phim/${e.slug}${e.episodeSlug ? `/tap/${e.episodeSlug}` : ""}`}
      className="group block"
      aria-label={`Xem tiếp ${e.name}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-ink-700/80 bg-ink-850 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-ember-500/70 group-hover:shadow-[0_18px_38px_-14px_rgba(244,64,84,0.3)]">
        <img
          src={imgUrl(e.thumb)}
          alt={e.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink-950/0 transition group-hover:bg-ink-950/45">
          <span className="flex h-11 w-11 scale-75 items-center justify-center rounded-full bg-ember-500 text-ink-950 opacity-0 shadow-[0_0_26px_rgba(244,64,84,0.6)] transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <IcPlay className="h-5 w-5" />
          </span>
        </span>
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/95 to-transparent px-2 pb-1.5 pt-5 text-right font-display text-sm tracking-wider text-ember-400">
          {e.episode || "Đang xem"}
        </span>
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-semibold text-fog-100 group-hover:text-ember-400">{e.name}</p>
      <p className="mt-0.5 text-xs text-fog-500">{timeAgo(new Date(e.at).toISOString())}</p>
    </Link>
  );
}

export default function HomePage() {
  const { entries, clear } = useHistory();

  const latest = useFetch("list:phim-moi-cap-nhat:1", () => getList("phim-moi-cap-nhat", 1));
  const single = useFetch("list:phim-le:1", () => getList("phim-le", 1));
  const series = useFetch("list:phim-bo:1", () => getList("phim-bo", 1));
  const cartoon = useFetch("list:hoat-hinh:1", () => getList("hoat-hinh", 1));
  const cinema = useFetch("list:phim-chieu-rap:1", () => getList("phim-chieu-rap", 1));

  useEffect(() => setDocTitle(""), []);

  return (
    <div>
      <Hero items={latest.data?.data?.items ?? []} loading={latest.loading} />
      <Ticker items={latest.data?.data?.items ?? []} />

      <div className="mx-auto w-full max-w-7xl space-y-14 px-4 pt-12 sm:px-6">
        {entries.length > 0 && (
          <Reveal as="section">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="font-display flex items-baseline gap-3 text-3xl tracking-wide text-fog-100 sm:text-4xl">
                <span className="inline-block h-7 w-1.5 -skew-x-12 rounded-sm bg-ember-500 sm:h-8" />
                <IcHistory className="h-7 w-7 text-ember-400" />
                Tiếp tục xem
              </h2>
              <button
                onClick={clear}
                className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-fog-500 transition hover:text-ember-400"
              >
                <IcTrash className="h-4 w-4" /> Xoá lịch sử
              </button>
            </div>
            <div className="row-scroll -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {entries.map((e) => (
                <div key={`${e.slug}-${e.episodeSlug}`} className="w-[42vw] shrink-0 snap-start sm:w-[176px]">
                  <HistoryCard e={e} />
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <MovieRow
          title="Mới cập nhật"
          to="/danh-sach/phim-moi-cap-nhat"
          items={(latest.data?.data?.items ?? []).slice(0, 16)}
          loading={latest.loading}
          error={latest.error}
        />

        <MovieRow
          title="Phim lẻ nổi bật"
          to="/danh-sach/phim-le"
          items={(single.data?.data?.items ?? []).slice(0, 16)}
          loading={single.loading}
          error={single.error}
        />

        <Reveal>
          <FilmStrip />
        </Reveal>

        <MovieRow
          title="Phim bộ đang chiếu"
          to="/danh-sach/phim-bo"
          items={(series.data?.data?.items ?? []).slice(0, 16)}
          loading={series.loading}
          error={series.error}
          accent="ember"
        />

        <MovieRow
          title="Hoạt hình"
          to="/danh-sach/hoat-hinh"
          items={(cartoon.data?.data?.items ?? []).slice(0, 16)}
          loading={cartoon.loading}
          error={cartoon.error}
        />

        <MovieRow
          title="Đang chiếu rạp"
          to="/danh-sach/phim-chieu-rap"
          items={(cinema.data?.data?.items ?? []).slice(0, 16)}
          loading={cinema.loading}
          error={cinema.error}
          accent="ember"
        />

        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-ink-700 bg-gradient-to-r from-ink-900 to-ink-850 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-2xl tracking-wide text-fog-100 sm:text-3xl">
                LẠC VÀO THẾ GIỚI <span className="text-gold-400">ĐIỆN ẢNH</span>
              </p>
              <p className="mt-1 max-w-xl text-sm text-fog-500">
                Duyệt theo thể loại — từ hành động nghẹt thở đến tình cảm nhẹ nhàng, tất cả lấy trực tiếp từ API KKPhim.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["hanh-dong", "hai-huoc", "kinh-di", "tinh-cam", "vien-tuong"].map((s, i) => (
                <Link
                  key={s}
                  to={`/the-loai/${s}`}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition active:scale-95 ${
                    i % 2 === 0
                      ? "border-gold-500/50 text-gold-400 hover:bg-gold-500 hover:text-ink-950"
                      : "border-ink-600 text-fog-300 hover:border-ember-500 hover:text-ember-400"
                  }`}
                >
                  {["Hành động", "Hài hước", "Kinh dị", "Tình cảm", "Viễn tưởng"][i]}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export { SectionHead };

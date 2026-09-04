"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../lib/types";
import { epLabel, imgUrl } from "../lib/utils";
import { IcPlay } from "./icons";

export default function MovieCard({
  movie,
  note,
}: {
  movie: Movie;
  /** Dòng phụ dưới tên phim, mặc định là năm + thể loại đầu tiên */
  note?: string;
}) {
  const [broken, setBroken] = useState(false);
  const fallback = note ?? [movie.year, movie.category?.[0]?.name].filter(Boolean).join(" · ");

  return (
    <Link
      to={`/phim/${movie.slug}`}
      className="group block outline-none"
      aria-label={movie.name}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-ink-700/80 bg-ink-850 shadow-[0_10px_28px_-14px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-gold-500/60 group-hover:shadow-[0_18px_38px_-14px_rgba(245,179,1,0.28)]">
        {!broken ? (
          <img
            src={imgUrl(movie.thumb_url || movie.poster_url)}
            alt={movie.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <img
            src={imgUrl(undefined)}
            alt={movie.name}
            className="h-full w-full object-cover"
          />
        )}

        {/* nhãn chất lượng / ngôn ngữ */}
        <div className="absolute left-0 top-0 flex flex-col items-start gap-1 p-1.5">
          {movie.quality && (
            <span className="rounded-sm bg-gold-500 px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-ink-950">
              {movie.quality}
            </span>
          )}
          {movie.lang && (
            <span className="rounded-sm bg-ember-600/95 px-1.5 py-0.5 text-[10px] font-bold leading-none text-fog-100">
              {movie.lang}
            </span>
          )}
        </div>

        {/* nhãn tập / trạng thái */}
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-transparent px-2 pb-1.5 pt-6 text-right font-display text-sm tracking-wider text-gold-300">
          {epLabel(movie)}
        </span>

        {/* overlay khi hover */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/95 via-ink-950/35 to-transparent p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            <p className="font-display text-lg leading-tight tracking-wide text-fog-100">
              {movie.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-gold-400">
              <IcPlay className="h-3 w-3" /> Xem chi tiết
            </p>
          </div>
        </div>
      </div>

      <p className="mt-2 line-clamp-1 text-sm font-semibold text-fog-100 transition-colors group-hover:text-gold-300">
        {movie.name}
      </p>
      <p className="mt-0.5 line-clamp-1 text-xs text-fog-500">{fallback}</p>
    </Link>
  );
}

"use client";

import { Link } from "react-router-dom";
import type { HistoryEntry } from "../lib/types";
import { imgUrl, timeAgo } from "../lib/utils";
import { IcPlay, IcX } from "./icons";

/** Thẻ "xem tiếp": poster + đúng tập đang xem dở, kèm nút bỏ khỏi danh sách (tuỳ chọn). */
export default function ContinueCard({
  entry,
  onRemove,
}: {
  entry: HistoryEntry;
  onRemove?: () => void;
}) {
  const watchTo = `/phim/${entry.slug}${entry.episodeSlug ? `/tap/${entry.episodeSlug}` : ""}`;

  return (
    <div className="group relative">
      <Link to={watchTo} className="block" aria-label={`Xem tiếp ${entry.name}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-ink-700/80 bg-ink-850 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-ember-500/70 group-hover:shadow-[0_18px_38px_-14px_rgba(244,64,84,0.3)]">
          <img
            src={imgUrl(entry.thumb)}
            alt={entry.name}
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
            {entry.episode || "Đang xem"}
          </span>
        </div>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Bỏ ${entry.name} khỏi danh sách xem tiếp`}
          className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-ink-700 bg-ink-950/85 text-fog-500 opacity-0 transition hover:border-ember-500 hover:text-ember-400 focus-visible:opacity-100 group-hover:opacity-100"
        >
          <IcX className="h-3.5 w-3.5" />
        </button>
      )}
      <p className="mt-2 line-clamp-1 text-sm font-semibold text-fog-100 transition group-hover:text-ember-400">
        {entry.name}
      </p>
      <p className="mt-0.5 text-xs text-fog-500">
        {[entry.episode, timeAgo(new Date(entry.at).toISOString())].filter(Boolean).join(" · ")}
      </p>
    </div>
  );
}

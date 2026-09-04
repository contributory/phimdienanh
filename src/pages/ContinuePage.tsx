"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import ContinueCard from "../components/ContinueCard";
import { IcHistory, IcTrash } from "../components/icons";
import { EmptyState, Reveal } from "../components/ui";
import { latestByMovie, useHistory } from "../hooks/useHistory";
import { setDocTitle } from "../lib/utils";

/** Trang "Xem tiếp" — toàn bộ phim đang xem dở, quay lại đúng tập đã dừng. */
export default function ContinuePage() {
  const { entries, clear, remove } = useHistory();
  const movies = latestByMovie(entries);

  useEffect(() => setDocTitle("Xem tiếp"), []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-fog-500" aria-label="Breadcrumb">
        <Link to="/" className="transition hover:text-gold-400">Trang chủ</Link>
        <span>/</span>
        <span className="text-fog-300">Xem tiếp</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display flex items-baseline gap-3 text-4xl tracking-wide text-fog-100 sm:text-6xl">
          <span className="inline-block h-7 w-1.5 -skew-x-12 rounded-sm bg-ember-500 sm:h-8" />
          <IcHistory className="h-7 w-7 self-center text-ember-400" />
          Xem tiếp
        </h1>
        {movies.length > 0 && (
          <button
            onClick={clear}
            className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-fog-500 transition hover:text-ember-400"
          >
            <IcTrash className="h-4 w-4" /> Xoá tất cả
          </button>
        )}
      </header>

      {movies.length === 0 ? (
        <EmptyState
          title="CHƯA CÓ PHIM ĐANG XEM DỞ"
          note="Bắt đầu xem một bộ phim — mục Xem tiếp sẽ ghi nhớ đúng tập bạn đang xem để quay lại tiếp tục."
        />
      ) : (
        <>
          <p className="mb-5 text-sm font-semibold text-fog-500">
            {movies.length} phim đang xem dở — bấm vào một thẻ để tiếp tục đúng tập đã dừng.
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((e, i) => (
              <Reveal key={e.slug} delay={Math.min(i % 6, 5) * 50}>
                <ContinueCard entry={e} onRemove={() => remove(e.slug)} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

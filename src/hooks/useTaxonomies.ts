import { useEffect, useState } from "react";
import { COUNTRIES, GENRES, YEARS, getCountries, getGenres, getYears } from "../lib/api";

export interface Taxonomies {
  genres: { slug: string; name: string }[];
  countries: { slug: string; name: string }[];
  years: number[];
}

/**
 * Danh mục động (thể loại / quốc gia / năm) tải 1 lần từ API
 * (/the-loai, /quoc-gia, /nam-phat-hanh) — chia sẻ qua module cache,
 * fallback về hằng số GENRES / COUNTRIES / YEARS khi lỗi mạng.
 */
const FALLBACK: Taxonomies = {
  genres: GENRES.map((g) => ({ ...g })),
  countries: COUNTRIES.map((c) => ({ ...c })),
  years: [...YEARS],
};

let cache: Taxonomies | null = null;
let pending: Promise<Taxonomies> | null = null;

function load(): Promise<Taxonomies> {
  if (cache) return Promise.resolve(cache);
  pending ??= Promise.all([
    getGenres().then((r) => r.data?.items ?? []).catch(() => []),
    getCountries().then((r) => r.data?.items ?? []).catch(() => []),
    getYears().catch(() => [] as number[]),
  ]).then(([genres, countries, years]) => {
    const t: Taxonomies = {
      genres: genres.length ? genres : FALLBACK.genres,
      countries: countries.length ? countries : FALLBACK.countries,
      years: years.length ? years : FALLBACK.years,
    };
    cache = t;
    return t;
  });
  return pending;
}

export function useTaxonomies(): Taxonomies {
  const [tax, setTax] = useState<Taxonomies>(cache ?? FALLBACK);

  useEffect(() => {
    if (cache) {
      setTax(cache);
      return;
    }
    let active = true;
    load().then((t) => {
      if (active) setTax(t);
    });
    return () => {
      active = false;
    };
  }, []);

  return tax;
}

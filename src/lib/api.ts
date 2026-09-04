import type { DetailPayload, ListPayload, Movie, ServerGroup } from "./types";

/**
 * Client bọc toàn bộ API công khai của KKPhim theo tài liệu MỚI NHẤT
 * (https://kkphim.com/api-document — Base URL: https://phimapi.com, chuẩn v1).
 * Chạy 100% trên trình duyệt — không cần server trung gian.
 */
export const API_BASE = "https://phimapi.com";
export const CDN_BASE = "https://phimimg.com";
export const SITE_BASE = "https://kkphim.com";

export class ApiError extends Error {
  kind: "network" | "http" | "api";
  httpStatus?: number;
  constructor(kind: ApiError["kind"], httpStatus?: number, message?: string) {
    super(
      message ??
        (kind === "network"
          ? "Không kết nối được tới máy chủ KKPhim (kiểm tra mạng / CORS / trình chặn quảng cáo)."
          : kind === "http"
            ? `Máy chủ trả về lỗi HTTP ${httpStatus}.`
            : "KKPhim API trả về trạng thái lỗi."),
    );
    this.kind = kind;
    this.httpStatus = httpStatus;
  }
}

async function request<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new ApiError("network");
  }
  if (!res.ok) throw new ApiError("http", res.status);
  const json = (await res.json()) as T & {
    status?: boolean | string;
    message?: string;
    msg?: string;
  };
  if (json && json.status === false) {
    throw new ApiError("api", undefined, json.message || json.msg || undefined);
  }
  return json;
}

/* ── Chuẩn hoá dữ liệu ─────────────────────────────────────────────────── */

type LegacyDetail = {
  status?: boolean | string;
  message?: string;
  msg?: string;
  movie?: Movie;
  episodes?: ServerGroup[];
};

/** Ảnh tương đối → tuyệt đối theo CDN của API (mặc định phimimg.com). */
function absImg(url?: string, base = CDN_BASE): string | undefined {
  if (!url || /^https?:\/\//i.test(url)) return url;
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** API mới đổi `episode_time` → `time` và `chieu_rap` → `chieurap`. */
function normalizeMovie(m: Movie): Movie {
  return {
    ...m,
    episode_time: m.episode_time ?? m.time,
    chieu_rap: m.chieu_rap ?? m.chieurap,
  };
}

/**
 * Danh sách v1 trả pagination trong `data.params.pagination` và ảnh tương đối
 * (`data.APP_DOMAIN_CDN_IMAGE`) — nâng lên vị trí cũ để toàn bộ UI dùng ngay.
 */
function normalizeList(res: ListPayload): ListPayload {
  const data = res.data ?? {};
  const pagination = res.pagination ?? data.params?.pagination;
  const cdn = data.APP_DOMAIN_CDN_IMAGE || CDN_BASE;
  const items = (data.items ?? []).map((m) => ({
    ...normalizeMovie(m),
    thumb_url: absImg(m.thumb_url, cdn),
    poster_url: absImg(m.poster_url, cdn),
  }));
  return { ...res, pagination, data: { ...data, items } };
}

/** Chi tiết v1 bọc episodes trong item — nâng lên `data.episodes` như cũ. */
function normalizeDetail(res: DetailPayload): DetailPayload {
  const data = res.data ?? {};
  const item = data.item ? normalizeMovie(data.item) : undefined;
  if (item) {
    item.thumb_url = absImg(item.thumb_url);
    item.poster_url = absImg(item.poster_url);
  }
  const episodes = data.episodes ?? item?.episodes ?? [];
  return { ...res, data: { ...data, item, episodes } };
}

/** Chi tiết kiểu cũ ({ movie, episodes }) → bọc về shape { data: { item, episodes } }. */
function fromLegacyDetail(res: LegacyDetail): DetailPayload {
  const movie = res.movie ? normalizeMovie(res.movie) : undefined;
  if (movie) {
    movie.thumb_url = absImg(movie.thumb_url);
    movie.poster_url = absImg(movie.poster_url);
  }
  return {
    status: res.status ?? true,
    message: res.message ?? res.msg,
    data: { item: movie, episodes: res.episodes ?? [] },
  };
}

/* ── Danh sách (chuẩn v1, hỗ trợ đầy đủ bộ lọc & sắp xếp) ───────────────── */

/** "Phim mới" v1 — /v1/api/danh-sach (không cần slug). */
export const getNewMovies = (page = 1) =>
  request<ListPayload>(`/v1/api/danh-sach?page=${page}`).then(normalizeList);

export const getList = (typeSlug: string, page = 1) =>
  request<ListPayload>(`/v1/api/danh-sach/${typeSlug}?page=${page}`).then(normalizeList);

export const getGenreList = (slug: string, page = 1) =>
  request<ListPayload>(`/v1/api/the-loai/${slug}?page=${page}`).then(normalizeList);

export const getCountryList = (slug: string, page = 1) =>
  request<ListPayload>(`/v1/api/quoc-gia/${slug}?page=${page}`).then(normalizeList);

export const getYearList = (year: string | number, page = 1) =>
  request<ListPayload>(`/v1/api/nam/${year}?page=${page}`).then(normalizeList);

export const searchMovies = (keyword: string, page = 1, limit = 24) =>
  request<ListPayload>(
    `/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=${limit}&page=${page}`,
  ).then(normalizeList);

/**
 * Danh sách v1 với bộ lọc chung (mục "Bộ lọc & Sắp xếp" trong tài liệu):
 * category, country, year (kể cả dải "2014,2024"), sort_field, sort_type, sort_lang, limit.
 */
export function getFilteredList(opts: {
  typeSlug?: string;
  page?: number;
  category?: string;
  country?: string;
  year?: string | number;
  sortField?: "modified.time" | "_id" | "year";
  sortType?: "desc" | "asc";
  sortLang?: "vietsub" | "thuyet-minh" | "long-tieng";
  limit?: number;
}) {
  const q = new URLSearchParams();
  q.set("page", String(opts.page ?? 1));
  if (opts.category) q.set("category", opts.category);
  if (opts.country) q.set("country", opts.country);
  if (opts.year !== undefined) q.set("year", String(opts.year));
  if (opts.sortField) q.set("sort_field", opts.sortField);
  if (opts.sortType) q.set("sort_type", opts.sortType);
  if (opts.sortLang) q.set("sort_lang", opts.sortLang);
  if (opts.limit) q.set("limit", String(opts.limit));
  const base = opts.typeSlug ? `/v1/api/danh-sach/${opts.typeSlug}` : "/v1/api/danh-sach";
  return request<ListPayload>(`${base}?${q}`).then(normalizeList);
}

/* ── Danh mục động ─────────────────────────────────────────────────────── */

export interface TaxonomyRes {
  status?: boolean | string;
  message?: string;
  data?: { items?: { _id?: string; id?: string; name: string; slug: string }[] };
}

export const getGenres = () => request<TaxonomyRes>(`/the-loai`);

export const getCountries = () => request<TaxonomyRes>(`/quoc-gia`);

/** Danh sách năm phát hành từ API (từ năm hiện tại về 1911). */
export const getYears = () =>
  request<{ status?: boolean | string; message?: string; data?: { items?: { year: number }[] } }>(`/nam-phat-hanh`).then((r) =>
    (r.data?.items ?? []).map((x) => x.year).sort((a, b) => b - a),
  );

/* ── Chi tiết & tập phim ───────────────────────────────────────────────── */

/** Chi tiết phim v1 — data.item (đã kèm episodes, được nâng lên data.episodes). */
export const getMovieDetail = (slug: string) =>
  request<DetailPayload>(`/v1/api/phim/${slug}`).then(normalizeDetail);

/* ── Tra cứu mở rộng (mới) ─────────────────────────────────────────────── */

/** Tra cứu theo _id của phim. */
export const getMovieById = (id: string) =>
  request<LegacyDetail>(`/phim/id/${id}`).then(fromLegacyDetail);

/** Tra cứu theo TMDB — type là movie hoặc tv. */
export const getMovieByTmdb = (type: "movie" | "tv", id: string | number) =>
  request<LegacyDetail>(`/tmdb/${type}/${id}`).then(fromLegacyDetail);

/** Tra cứu theo IMDB. */
export const getMovieByImdb = (id: string) =>
  request<LegacyDetail>(`/imdb/title/${id}`).then(fromLegacyDetail);

/* ── Hằng số điều hướng (fallback khi chưa tải được danh mục động) ──────── */

export const LIST_TYPES = [
  { slug: "phim-moi-cap-nhat", label: "Mới cập nhật" },
  { slug: "phim-bo", label: "Phim bộ" },
  { slug: "phim-le", label: "Phim lẻ" },
  { slug: "hoat-hinh", label: "Hoạt hình" },
  { slug: "phim-chieu-rap", label: "Chiếu rạp" },
] as const;

export const GENRES = [
  { slug: "hanh-dong", name: "Hành Động" },
  { slug: "hai-huoc", name: "Hài Hước" },
  { slug: "tinh-cam", name: "Tình Cảm" },
  { slug: "kinh-di", name: "Kinh Dị" },
  { slug: "phieu-luu", name: "Phiêu Lưu" },
  { slug: "vien-tuong", name: "Viễn Tưởng" },
  { slug: "tam-ly", name: "Tâm Lý" },
  { slug: "hinh-su", name: "Hình Sự" },
  { slug: "vo-thuat", name: "Võ Thuật" },
  { slug: "co-trang", name: "Cổ Trang" },
  { slug: "than-thoai", name: "Thần Thoại" },
  { slug: "gia-dinh", name: "Gia Đình" },
  { slug: "hoc-duong", name: "Học Đường" },
  { slug: "chien-tranh", name: "Chiến Tranh" },
  { slug: "bi-an", name: "Bí Ẩn" },
  { slug: "am-nhac", name: "Âm Nhạc" },
  { slug: "chinh-kich", name: "Chính Kịch" },
  { slug: "khoa-hoc", name: "Khoa Học" },
  { slug: "kinh-dien", name: "Kinh Điển" },
  { slug: "lich-su", name: "Lịch Sử" },
  { slug: "mien-tay", name: "Miền Tây" },
  { slug: "the-thao", name: "Thể Thao" },
  { slug: "tre-em", name: "Trẻ Em" },
  { slug: "tai-lieu", name: "Tài Liệu" },
  { slug: "phim-ngan", name: "Phim Ngắn" },
  { slug: "phim-18", name: "Phim 18+" },
] as const;

export const COUNTRIES = [
  { slug: "han-quoc", name: "Hàn Quốc" },
  { slug: "trung-quoc", name: "Trung Quốc" },
  { slug: "nhat-ban", name: "Nhật Bản" },
  { slug: "thai-lan", name: "Thái Lan" },
  { slug: "au-my", name: "Âu Mỹ" },
  { slug: "viet-nam", name: "Việt Nam" },
  { slug: "hong-kong", name: "Hồng Kông" },
  { slug: "dai-loan", name: "Đài Loan" },
  { slug: "an-do", name: "Ấn Độ" },
  { slug: "anh", name: "Anh" },
  { slug: "phap", name: "Pháp" },
  { slug: "nga", name: "Nga" },
  { slug: "uc", name: "Úc" },
  { slug: "y", name: "Ý" },
  { slug: "duc", name: "Đức" },
  { slug: "canada", name: "Canada" },
  { slug: "tay-ban-nha", name: "Tây Ban Nha" },
  { slug: "bo-dao-nha", name: "Bồ Đào Nha" },
  { slug: "ha-lan", name: "Hà Lan" },
  { slug: "thuy-dien", name: "Thụy Điển" },
  { slug: "thuy-si", name: "Thụy Sĩ" },
  { slug: "na-uy", name: "Na Uy" },
  { slug: "dan-mach", name: "Đan Mạch" },
  { slug: "ba-lan", name: "Ba Lan" },
  { slug: "ukraina", name: "Ukraina" },
  { slug: "brazil", name: "Brazil" },
  { slug: "mexico", name: "Mexico" },
  { slug: "indonesia", name: "Indonesia" },
  { slug: "malaysia", name: "Malaysia" },
  { slug: "philippines", name: "Philippines" },
  { slug: "tho-nhi-ky", name: "Thổ Nhĩ Kỳ" },
  { slug: "a-rap-xe-ut", name: "Ả Rập Xê Út" },
  { slug: "uae", name: "UAE" },
  { slug: "chau-phi", name: "Châu Phi" },
  { slug: "nam-phi", name: "Nam Phi" },
  { slug: "quoc-gia-khac", name: "Quốc Gia Khác" },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 12 }, (_, i) => CURRENT_YEAR - i);

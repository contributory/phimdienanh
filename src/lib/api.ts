import type { DetailPayload, ListPayload } from "./types";

/**
 * Client bọc toàn bộ API công khai của KKPhim (https://kkphim.com/api-document).
 * Chạy 100% trên trình duyệt — không cần server trung gian.
 */
export const API_BASE = "https://kkphim.com/api";
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
  const json = (await res.json()) as T & { status?: boolean; message?: string };
  if (json && json.status === false) {
    throw new ApiError("api", undefined, json.message || undefined);
  }
  return json;
}

/* ── Danh sách ─────────────────────────────────────────────────────────── */
export const getNewMovies = (page = 1) =>
  request<ListPayload>(`/phim-moi?page=${page}`);

export const getList = (typeSlug: string, page = 1) =>
  request<ListPayload>(`/danh-sach/${typeSlug}?page=${page}`);

export const getGenreList = (slug: string, page = 1) =>
  request<ListPayload>(`/the-loai/${slug}?page=${page}`);

export const getGenres = () =>
  request<{ status: boolean; message?: string; data?: { items: { id?: string; name: string; slug: string }[] } }>("/the-loai");

export const getCountryList = (slug: string, page = 1) =>
  request<ListPayload>(`/quoc-gia/${slug}?page=${page}`);

export const getYearList = (year: string | number, page = 1) =>
  request<ListPayload>(`/nam/${year}?page=${page}`);

export const searchMovies = (keyword: string, page = 1) =>
  request<ListPayload>(`/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`);

/* ── Chi tiết & tập phim ───────────────────────────────────────────────── */
export const getMovieDetail = (slug: string) =>
  request<DetailPayload>(`/phim/${slug}`);

export const getEpisode = (movieSlug: string, episodeSlug: string) =>
  request<DetailPayload>(`/phim/${movieSlug}/${episodeSlug}`);

/* ── Hằng số điều hướng ────────────────────────────────────────────────── */
export const LIST_TYPES = [
  { slug: "phim-moi-cap-nhat", label: "Mới cập nhật" },
  { slug: "phim-bo", label: "Phim bộ" },
  { slug: "phim-le", label: "Phim lẻ" },
  { slug: "hoat-hinh", label: "Hoạt hình" },
  { slug: "phim-chieu-rap", label: "Chiếu rạp" },
] as const;

export const GENRES = [
  { slug: "hanh-dong", name: "Hành động" },
  { slug: "hai-huoc", name: "Hài hước" },
  { slug: "tinh-cam", name: "Tình cảm" },
  { slug: "kinh-di", name: "Kinh dị" },
  { slug: "phieu-luu", name: "Phiêu lưu" },
  { slug: "vien-tuong", name: "Viễn tưởng" },
  { slug: "tam-ly", name: "Tâm lý" },
  { slug: "hinh-su", name: "Hình sự" },
  { slug: "vo-thuat", name: "Võ thuật" },
  { slug: "co-trang", name: "Cổ trang" },
  { slug: "than-thoai", name: "Thần thoại" },
  { slug: "gia-dinh", name: "Gia đình" },
  { slug: "hoc-duong", name: "Học đường" },
  { slug: "chien-tranh", name: "Chiến tranh" },
  { slug: "bi-an", name: "Bí ẩn" },
  { slug: "am-nhac", name: "Âm nhạc" },
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
] as const;

const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - i);

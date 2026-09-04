import { SITE_BASE } from "./api";

/** Ảnh từ KKPhim đôi khi là đường dẫn tương đối — chuẩn hoá về absolute. */
export function imgUrl(url?: string): string {
  if (!url) return FALLBACK_POSTER;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export const FALLBACK_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 300'><rect width='200' height='300' fill='#1a1622'/><g fill='#2e2640'><rect x='0' y='0' width='200' height='14'/><rect x='0' y='286' width='200' height='14'/></g><g fill='#0d0b11'><circle cx='20' cy='7' r='3.4'/><circle cx='50' cy='7' r='3.4'/><circle cx='80' cy='7' r='3.4'/><circle cx='110' cy='7' r='3.4'/><circle cx='140' cy='7' r='3.4'/><circle cx='170' cy='7' r='3.4'/><circle cx='20' cy='293' r='3.4'/><circle cx='50' cy='293' r='3.4'/><circle cx='80' cy='293' r='3.4'/><circle cx='110' cy='293' r='3.4'/><circle cx='140' cy='293' r='3.4'/><circle cx='170' cy='293' r='3.4'/></g><path d='M84 128 L124 150 L84 172 Z' fill='#f5b301'/><text x='100' y='204' text-anchor='middle' font-family='monospace' font-size='11' fill='#8a8099'>KHÔNG CÓ ẢNH</text></svg>`,
  );

/** Lọc thẻ HTML trong trường `content` của API. */
export function stripHtml(html?: string): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

export function timeAgo(iso?: string): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ngày trước`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} tháng trước`;
  return `${Math.floor(mo / 12)} năm trước`;
}

export function setDocTitle(title: string) {
  document.title = title
    ? `${title} • Phim Điện Ảnh`
    : "Phim Điện Ảnh — Xem phim online · API KKPhim";
}

/** Rút gọn số tập / nhãn trạng thái */
export function epLabel(m: {
  type?: string;
  episode_current?: string;
  episode_total?: string | number;
  quality?: string;
}): string {
  if (m.type === "series") {
    const cur = m.episode_current || "";
    const total = m.episode_total;
    if (total && cur && !cur.includes(String(total))) return `${cur}/${total}`;
    return cur || "Đang ra";
  }
  return m.quality || "HD";
}

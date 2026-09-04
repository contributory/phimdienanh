/* Kiểu dữ liệu khớp với tài liệu API mới nhất https://kkphim.com/api-document (base phimapi.com, chuẩn v1) */

export interface TaxonomyRef {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

export interface Movie {
  slug: string;
  name: string;
  origin_name?: string;
  content?: string;
  type?: "single" | "series" | string;
  status?: "completed" | "ongoing" | string;
  thumb_url?: string;
  poster_url?: string;
  is_copyright?: boolean;
  sub_docquyen?: boolean;
  chieu_rap?: boolean;
  lang?: string;
  quality?: string;
  episode_time?: string;
  episode_current?: string;
  episode_total?: string | number;
  total_episodes?: number;
  /* các trường mới của API (chuẩn v1) */
  time?: string;
  view?: number;
  trailer_url?: string;
  alternative_names?: string[];
  lang_key?: string;
  is_published?: boolean;
  notify?: string;
  showtimes?: unknown[];
  last_episodes?: unknown;
  chieurap?: boolean;
  year?: number;
  actor?: string[];
  director?: string[];
  category?: TaxonomyRef[];
  country?: TaxonomyRef[];
  tmdb?: { type?: string; id?: string };
  imdb?: { id?: string };
  modified?: { time?: string; time_human?: string };
  created?: { time?: string; time_human?: string };
  /* bản v1: episodes nằm trong item */
  episodes?: ServerGroup[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename?: string;
  link_embed?: string;
  link_m3u8?: string;
  preview?: string | null;
}

export interface ServerGroup {
  server_name: string;
  server_data: EpisodeData[];
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ListPayload {
  status: boolean | string;
  message?: string;
  /** chuẩn hoá từ data.params.pagination của bản v1 */
  pagination?: Pagination;
  data?: {
    seoOnPage?: unknown;
    breadCrumb?: unknown[];
    titlePage?: string;
    items?: Movie[];
    params?: { pagination?: Pagination } & Record<string, unknown>;
    type_list?: unknown;
    APP_DOMAIN_CDN_IMAGE?: string;
    APP_DOMAIN_FRONTEND?: string;
  };
}

export interface DetailPayload {
  status: boolean | string;
  message?: string;
  data?: {
    seoOnPage?: unknown;
    breadCrumb?: unknown[];
    item?: Movie;
    episodes?: ServerGroup[];
  };
}

export interface HistoryEntry {
  slug: string;
  name: string;
  thumb?: string;
  episode?: string;
  episodeSlug?: string;
  at: number;
}

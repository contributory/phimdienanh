/* Kiểu dữ liệu khớp với tài liệu API https://kkphim.com/api-document */

export interface TaxonomyRef {
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
  year?: number;
  actor?: string[];
  director?: string[];
  category?: TaxonomyRef[];
  country?: TaxonomyRef[];
  tmdb?: { type?: string; id?: string };
  imdb?: { id?: string };
  modified?: { time?: string; time_human?: string };
  created?: { time?: string; time_human?: string };
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
  status: boolean;
  message?: string;
  pagination?: Pagination;
  data?: {
    seoOnPage?: unknown;
    breadCrumb?: unknown[];
    titlePage?: string;
    items?: Movie[];
    params?: Record<string, unknown>;
    type_list?: unknown;
  };
}

export interface DetailPayload {
  status: boolean;
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

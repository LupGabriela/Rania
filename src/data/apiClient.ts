export const API_BASE = "http://localhost:3001/api";

export interface DressRecord {
  id: string;
  name: string;
  price: number;
  material: string;
  sizes: string[];
  stockQuantity: number;
  description: string;
  imageUrl: string;
}

export interface PaginatedDresses {
  data: DressRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Review {
  id: string;
  dressId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewStats {
  count: number;
  averageRating: number;
  distribution: Record<number, number>;
}

export interface DressStats {
  totalDresses: number;
  totalStock: number;
  averagePrice: number;
  outOfStock: number;
  byMaterial: Record<string, number>;
  bySize: Record<string, number>;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Dresses ───────────────────────────────────────────────────────────────────

export function fetchDresses(page = 1, limit = 10): Promise<PaginatedDresses> {
  return request<PaginatedDresses>(`/dresses?page=${page}&limit=${limit}`);
}

export function fetchDress(id: string): Promise<DressRecord> {
  return request<DressRecord>(`/dresses/${id}`);
}

export function fetchStats(): Promise<DressStats> {
  return request<DressStats>("/dresses/stats");
}

export function createDress(data: Omit<DressRecord, "id">): Promise<DressRecord> {
  return request<DressRecord>("/dresses", { method: "POST", body: JSON.stringify(data) });
}

export function updateDress(id: string, data: Omit<DressRecord, "id">): Promise<DressRecord> {
  return request<DressRecord>(`/dresses/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteDress(id: string): Promise<void> {
  return request<void>(`/dresses/${id}`, { method: "DELETE" });
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export function fetchReviews(dressId: string): Promise<Review[]> {
  return request<Review[]>(`/dresses/${dressId}/reviews`);
}

export function fetchReviewStats(dressId: string): Promise<ReviewStats> {
  return request<ReviewStats>(`/dresses/${dressId}/reviews/stats`);
}

export function createReview(dressId: string, data: Pick<Review, "author" | "rating" | "comment">): Promise<Review> {
  return request<Review>(`/dresses/${dressId}/reviews`, { method: "POST", body: JSON.stringify(data) });
}

export function updateReview(id: string, data: Pick<Review, "author" | "rating" | "comment">): Promise<Review> {
  return request<Review>(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteReview(id: string): Promise<void> {
  return request<void>(`/reviews/${id}`, { method: "DELETE" });
}

// ── Generator ─────────────────────────────────────────────────────────────────

export function startGenerator(intervalMs = 3000): Promise<{ message: string; intervalMs: number }> {
  return request("/generator/start", { method: "POST", body: JSON.stringify({ interval: intervalMs }) });
}

export function stopGenerator(): Promise<{ message: string }> {
  return request("/generator/stop", { method: "POST" });
}

export function getGeneratorStatus(): Promise<{ running: boolean }> {
  return request("/generator/status");
}

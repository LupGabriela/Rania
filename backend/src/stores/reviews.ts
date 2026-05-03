import { v4 as uuidv4 } from "uuid";

export interface Review {
  id: string;
  dressId: string;
  author: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

export interface ReviewStats {
  count: number;
  averageRating: number;
  distribution: Record<number, number>;
}

let reviews: Review[] = [];

export function getByDressId(dressId: string): Review[] {
  return reviews.filter((r) => r.dressId === dressId);
}

export function getById(id: string): Review | undefined {
  return reviews.find((r) => r.id === id);
}

export function create(data: Omit<Review, "id" | "createdAt">): Review {
  const review: Review = { id: uuidv4(), ...data, createdAt: new Date().toISOString() };
  reviews.push(review);
  return review;
}

export function update(
  id: string,
  data: Pick<Review, "author" | "rating" | "comment">
): Review | undefined {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  reviews[index] = { ...reviews[index], ...data };
  return reviews[index];
}

export function remove(id: string): boolean {
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return false;
  reviews.splice(index, 1);
  return true;
}

export function getStats(dressId: string): ReviewStats {
  const list = getByDressId(dressId);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (list.length === 0) return { count: 0, averageRating: 0, distribution };
  let total = 0;
  for (const r of list) {
    distribution[r.rating]++;
    total += r.rating;
  }
  return {
    count: list.length,
    averageRating: Math.round((total / list.length) * 10) / 10,
    distribution,
  };
}

export function reset(): void {
  reviews = [];
}

export type Material = "Silk" | "Chiffon" | "Satin" | "Lace" | "Cotton";
export type DressSize = "XS" | "S" | "M" | "L" | "XL";

export interface DressRecord {
  id: string;
  name: string;
  price: number;
  material: Material;
  sizes: DressSize[];
  stockQuantity: number;
  description: string;
  imageUrl: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StatsResponse {
  totalDresses: number;
  totalStock: number;
  averagePrice: number;
  outOfStock: number;
  byMaterial: Record<Material, number>;
  bySize: Record<DressSize, number>;
}

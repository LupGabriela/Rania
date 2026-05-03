import { v4 as uuidv4 } from "uuid";
import type { DressRecord, Material, DressSize } from "./types";

const SEED: DressRecord[] = [
  {
    id: uuidv4(),
    name: "Florentine Bloom",
    price: 1350,
    material: "Chiffon",
    sizes: ["XS", "S", "M", "L"],
    stockQuantity: 12,
    description:
      "A dreamy floral summer dress crafted in lightweight chiffon. Features a flattering A-line silhouette with delicate floral embroidery along the hem.",
    imageUrl:
      "https://images.unsplash.com/photo-1761574039846-a320885dd8f3?w=600",
  },
  {
    id: uuidv4(),
    name: "Seraphine Gown",
    price: 2490,
    material: "Silk",
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 8,
    description:
      "An enchanting silk evening gown that drapes beautifully. Perfect for formal events, galas, and special occasions.",
    imageUrl:
      "https://images.unsplash.com/photo-1756483509162-b92ea967a884?w=600",
  },
  {
    id: uuidv4(),
    name: "Celestine Lace",
    price: 3250,
    material: "Lace",
    sizes: ["XS", "S", "M"],
    stockQuantity: 5,
    description:
      "A romantic bridal-inspired lace dress with intricate floral detailing. Crafted from premium French lace over a delicate satin lining.",
    imageUrl:
      "https://images.unsplash.com/photo-1765871903122-d6e7cdb1c020?w=600",
  },
  {
    id: uuidv4(),
    name: "Aria Pastel Maxi",
    price: 1520,
    material: "Cotton",
    sizes: ["S", "M", "L"],
    stockQuantity: 15,
    description:
      "A flowing pastel maxi dress with a bohemian spirit. Ideal for summer festivals, beach vacations, and casual elegant gatherings.",
    imageUrl:
      "https://images.unsplash.com/photo-1702116135477-4a1477368ca4?w=600",
  },
  {
    id: uuidv4(),
    name: "Rouge Soir",
    price: 2120,
    material: "Satin",
    sizes: ["XS", "S", "M", "L", "XL"],
    stockQuantity: 0,
    description:
      "A bold and sophisticated cocktail dress in deep red. The structured bodice and flared skirt create a striking silhouette.",
    imageUrl:
      "https://images.unsplash.com/photo-1765229279946-f265fa703385?w=600",
  },
  {
    id: uuidv4(),
    name: "Azura Satin",
    price: 1860,
    material: "Satin",
    sizes: ["S", "M", "L"],
    stockQuantity: 9,
    description:
      "A stunning satin dress in rich cerulean blue. The sleek, minimalist design with a subtle cowl neck creates understated luxury.",
    imageUrl:
      "https://images.unsplash.com/photo-1704775983177-8ae543524081?w=600",
  },
  {
    id: uuidv4(),
    name: "Ivory Cascade",
    price: 2780,
    material: "Silk",
    sizes: ["XS", "S", "M", "L"],
    stockQuantity: 6,
    description:
      "An ethereal ivory silk dress with a waterfall hem. The fluid silhouette celebrates grace and elegance for special occasions.",
    imageUrl:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600",
  },
  {
    id: uuidv4(),
    name: "Velvet Noir",
    price: 3100,
    material: "Satin",
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 4,
    description:
      "A dramatic black velvet-effect satin gown with a sleek silhouette. Perfect for black tie events and formal evenings.",
    imageUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600",
  },
];

let dresses: DressRecord[] = [...SEED];

export const MATERIALS: Material[] = ["Silk", "Chiffon", "Satin", "Lace", "Cotton"];
export const SIZES: DressSize[] = ["XS", "S", "M", "L", "XL"];

export function getAll(): DressRecord[] {
  return dresses;
}

export function getById(id: string): DressRecord | undefined {
  return dresses.find((d) => d.id === id);
}

export function create(data: Omit<DressRecord, "id">): DressRecord {
  const dress: DressRecord = { id: uuidv4(), ...data };
  dresses.push(dress);
  return dress;
}

export function update(id: string, data: Omit<DressRecord, "id">): DressRecord | undefined {
  const index = dresses.findIndex((d) => d.id === id);
  if (index === -1) return undefined;
  const updated: DressRecord = { id, ...data };
  dresses[index] = updated;
  return updated;
}

export function remove(id: string): boolean {
  const index = dresses.findIndex((d) => d.id === id);
  if (index === -1) return false;
  dresses.splice(index, 1);
  return true;
}

export function reset(): void {
  dresses = [...SEED].map((d) => ({ ...d, id: uuidv4() }));
}

/**
 * RANIA — In-Memory Data Store
 * All dress data lives exclusively in this module-level array (RAM only).
 * No localStorage, no fetch, no external DB.
 */

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Material = "Silk" | "Chiffon" | "Satin" | "Lace" | "Cotton";
export type DressSize = "XS" | "S" | "M" | "L" | "XL";

export interface DressRecord {
  id: string;
  name: string;
  price: number;        // in RON
  material: Material;
  sizes: DressSize[];
  stockQuantity: number;
  description: string;
  imageUrl: string;
}

// ── Initial seed data (12 dresses) ────────────────────────────────────────────

const SEED_DRESSES: DressRecord[] = [
  {
    id: "1",
    name: "Florentine Bloom",
    price: 1350,
    material: "Chiffon",
    sizes: ["XS", "S", "M", "L"],
    stockQuantity: 12,
    description:
      "A dreamy floral summer dress crafted in lightweight chiffon. Features a flattering A-line silhouette with delicate floral embroidery along the hem, perfect for garden parties and warm evenings.",
    imageUrl:
      "https://images.unsplash.com/photo-1761574039846-a320885dd8f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "2",
    name: "Seraphine Gown",
    price: 2490,
    material: "Silk",
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 8,
    description:
      "An enchanting silk evening gown that drapes beautifully. The fluid silhouette and lustrous fabric make it perfect for formal events, galas, and special occasions that call for effortless elegance.",
    imageUrl:
      "https://images.unsplash.com/photo-1756483509162-b92ea967a884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "3",
    name: "Celestine Lace",
    price: 3250,
    material: "Lace",
    sizes: ["XS", "S", "M"],
    stockQuantity: 5,
    description:
      "A romantic bridal-inspired lace dress with intricate floral detailing. Crafted from premium French lace over a delicate satin lining, celebrating femininity and timeless grace.",
    imageUrl:
      "https://images.unsplash.com/photo-1765871903122-d6e7cdb1c020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "4",
    name: "Aria Pastel Maxi",
    price: 1520,
    material: "Cotton",
    sizes: ["S", "M", "L"],
    stockQuantity: 15,
    description:
      "A flowing pastel maxi dress with a bohemian spirit. The lightweight fabric moves gracefully with every step, making it ideal for summer festivals, beach vacations, and casual elegant gatherings.",
    imageUrl:
      "https://images.unsplash.com/photo-1702116135477-4a1477368ca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "5",
    name: "Rouge Soir",
    price: 2120,
    material: "Satin",
    sizes: ["XS", "S", "M", "L", "XL"],
    stockQuantity: 0,
    description:
      "A bold and sophisticated cocktail dress in deep red. The structured bodice and flared skirt create a striking silhouette perfect for cocktail parties, dinners, and celebrations.",
    imageUrl:
      "https://images.unsplash.com/photo-1765229279946-f265fa703385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "6",
    name: "Azura Satin",
    price: 1860,
    material: "Satin",
    sizes: ["S", "M", "L"],
    stockQuantity: 9,
    description:
      "A stunning satin dress in rich cerulean blue. The sleek, minimalist design with a subtle cowl neck creates an air of understated luxury, perfect for upscale events and formal dinners.",
    imageUrl:
      "https://images.unsplash.com/photo-1704775983177-8ae543524081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "7",
    name: "Verdana Wrap",
    price: 1210,
    material: "Chiffon",
    sizes: ["XS", "S", "M", "L", "XL"],
    stockQuantity: 18,
    description:
      "A refreshing green wrap dress with an adjustable tie waist and deep V-neckline. Versatile and feminine, it transitions seamlessly from a daytime brunch to an evening soirée.",
    imageUrl:
      "https://images.unsplash.com/photo-1636545659284-0481a5aab979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "8",
    name: "Luna Velvet",
    price: 2780,
    material: "Silk",
    sizes: ["S", "M", "L"],
    stockQuantity: 6,
    description:
      "A midnight-dark silk dress with a subtle velvet sheen. Floor-length with a daring slit, the Luna Velvet makes a powerful statement at any black-tie event or theatrical premiere.",
    imageUrl:
      "https://images.unsplash.com/photo-1759893362613-8bb8bb057af1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "9",
    name: "Blossom Midi",
    price: 980,
    material: "Cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    stockQuantity: 22,
    description:
      "A cheerful midi dress in printed cotton with a playful cherry blossom pattern. Breathable and easy to wear, ideal for daytime outings, picnics, and casual city strolls.",
    imageUrl:
      "https://images.unsplash.com/photo-1760287363707-851f4780b98c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "10",
    name: "Ophelia Gown",
    price: 3100,
    material: "Silk",
    sizes: ["XS", "S", "M"],
    stockQuantity: 3,
    description:
      "An ethereal ivory silk gown inspired by Pre-Raphaelite paintings. With delicate hand-stitched botanicals and a trailing hem, the Ophelia is a wearable work of art for ceremonial occasions.",
    imageUrl:
      "https://images.unsplash.com/photo-1756483509162-b92ea967a884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "11",
    name: "Coral Breeze",
    price: 1450,
    material: "Chiffon",
    sizes: ["S", "M", "L", "XL"],
    stockQuantity: 14,
    description:
      "A sun-kissed coral chiffon dress with an asymmetrical hem and spaghetti straps. Lightweight and airy, the Coral Breeze is the ultimate summer party dress for beach weddings and rooftop events.",
    imageUrl:
      "https://images.unsplash.com/photo-1761574039846-a320885dd8f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
  {
    id: "12",
    name: "Midnight Noir",
    price: 2350,
    material: "Satin",
    sizes: ["XS", "S", "M", "L"],
    stockQuantity: 7,
    description:
      "A sleek, figure-hugging satin dress in jet black. Classic and utterly versatile, the Midnight Noir moves from corporate dinners to late-night galas with effortless sophistication.",
    imageUrl:
      "https://images.unsplash.com/photo-1765229279946-f265fa703385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
  },
];

// ── Mutable in-memory state ───────────────────────────────────────────────────

let _dresses: DressRecord[] = SEED_DRESSES.map((d) => ({ ...d }));
let _nextId = 13;

/** Registered re-render callbacks (pub-sub pattern) */
const _listeners = new Set<() => void>();

function _notify(): void {
  _listeners.forEach((fn) => fn());
}

// ── Validation Logic ──────────────────────────────────────────────────────────

export function validateDressData(data: Omit<DressRecord, "id">): string[] {
  const errors: string[] = [];

  // Name validation
  if (!data.name || data.name.trim().length < 3) {
    errors.push("Dress name must be at least 3 characters long.");
  }

  // Price validation
  if (typeof data.price !== "number" || data.price <= 0) {
    errors.push("Price must be a valid number greater than 0.");
  }

  // Stock validation
  if (typeof data.stockQuantity !== "number" || data.stockQuantity < 0 || !Number.isInteger(data.stockQuantity)) {
    errors.push("Stock quantity cannot be negative and must be a whole number.");
  }

  // Description validation
  if (!data.description || data.description.trim().length < 10) {
    errors.push("Please provide a description of at least 10 characters.");
  }

  // Material validation
  if (!data.material) {
    errors.push("A material must be selected.");
  }

  return errors;
}

// ── CRUD Operations ───────────────────────────────────────────────────────────

/** Returns a shallow copy of the current dress array. */
export function getAllDresses(): DressRecord[] {
  return [..._dresses];
}

/** Finds a single dress by ID. Returns undefined if not found. */
export function getDressById(id: string): DressRecord | undefined {
  return _dresses.find((d) => d.id === id);
}

/** Adds a new dress. Throws an error if validation fails. */
export function addDress(data: Omit<DressRecord, "id">): DressRecord {
  const errors = validateDressData(data);
  if (errors.length > 0) {
    // Join all errors into a single string separated by newlines
    throw new Error(errors.join("\n")); 
  }

  const newDress: DressRecord = { ...data, id: String(_nextId++) };
  _dresses = [..._dresses, newDress];
  _notify();
  return newDress;
}

/** Updates an existing dress. Throws an error if validation fails. */
export function updateDress(
  id: string,
  data: Omit<DressRecord, "id">
): boolean {
  const errors = validateDressData(data);
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  const idx = _dresses.findIndex((d) => d.id === id);
  if (idx === -1) return false;
  
  _dresses = _dresses.map((d) => (d.id === id ? { ...data, id } : d));
  _notify();
  return true;
}
/** Deletes a dress by ID. Notifies subscribers on success. */
export function deleteDress(id: string): boolean {
  const before = _dresses.length;
  _dresses = _dresses.filter((d) => d.id !== id);
  if (_dresses.length !== before) {
    _notify();
    return true;
  }
  return false;
}

// ── React Hook ───────────────────────────────────────────────────────────────

/**
 * useDressStore — subscribes a component to all store mutations.
 * Any add/update/delete will automatically trigger a re-render.
 */
export function useDressStore(): DressRecord[] {
  const [dresses, setDresses] = useState<DressRecord[]>(() => getAllDresses());

  useEffect(() => {
    const refresh = () => setDresses(getAllDresses());
    _listeners.add(refresh);
    return () => {
      _listeners.delete(refresh);
    };
  }, []);

  return dresses;
}


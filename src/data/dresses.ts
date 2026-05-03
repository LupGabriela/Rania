export interface Dress {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes: string[];
  materials: string[];
  color: string;
  inStock: boolean;
  category: string;
}

export const dresses: Dress[] = [
  {
    id: "1",
    name: "Florentine Bloom",
    price: 285,
    description: "A dreamy floral summer dress crafted in lightweight chiffon. Perfect for garden parties and warm evenings, this piece features a flattering A-line silhouette with delicate floral embroidery along the hem.",
    image: "https://images.unsplash.com/photo-1761574039846-a320885dd8f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBzdW1tZXIlMjBkcmVzcyUyMHdvbWFuJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMyNjU0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: ["XS", "S", "M", "L"],
    materials: ["Chiffon"],
    color: "Blush",
    inStock: true,
    category: "Day Wear"
  },
  {
    id: "2",
    name: "Seraphine Gown",
    price: 520,
    description: "An enchanting silk evening gown that drapes beautifully. The fluid silhouette and lustrous fabric make it perfect for formal events, galas, and special occasions that call for effortless elegance.",
    image: "https://images.unsplash.com/photo-1756483509162-b92ea967a884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwZXZlbmluZyUyMGdvd24lMjBsdXh1cnklMjBmYXNoaW9ufGVufDF8fHx8MTc3MzI2NTQzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: ["S", "M", "L", "XL"],
    materials: ["Silk"],
    color: "Ivory",
    inStock: true,
    category: "Evening Wear"
  },
  {
    id: "3",
    name: "Celestine Lace",
    price: 680,
    description: "A romantic bridal-inspired lace dress with intricate floral detailing. Crafted from premium French lace over a delicate satin lining, this dress is a celebration of femininity and timeless grace.",
    image: "https://images.unsplash.com/photo-1765871903122-d6e7cdb1c020?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxhY2UlMjBicmlkYWwlMjBkcmVzcyUyMHJvbWFudGljfGVufDF8fHx8MTc3MzI2NTQzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: ["XS", "S", "M"],
    materials: ["Lace", "Satin"],
    color: "White",
    inStock: true,
    category: "Bridal"
  },
  {
    id: "4",
    name: "Aria Pastel Maxi",
    price: 320,
    description: "A flowing pastel maxi dress with a bohemian spirit. The lightweight fabric moves gracefully with every step, making it ideal for summer festivals, beach vacations, and casual elegant gatherings.",
    image: "https://images.unsplash.com/photo-1702116135477-4a1477368ca4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXhpJTIwZHJlc3MlMjBwYXN0ZWwlMjBmbG9yYWwlMjBib2hlbWlhbnxlbnwxfHx8fDE3NzMyNjU0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: ["S", "M", "L"],
    materials: ["Cotton", "Linen"],
    color: "Lilac",
    inStock: true,
    category: "Day Wear"
  },
  {
    id: "5",
    name: "Rouge Soir",
    price: 445,
    description: "A bold and sophisticated cocktail dress in deep red. The structured bodice and flared skirt create a striking silhouette perfect for cocktail parties, dinners, and celebrations.",
    image: "https://images.unsplash.com/photo-1765229279946-f265fa703385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyZXNzJTIwcmVkJTIwcGFydHklMjBmYXNoaW9ufGVufDF8fHx8MTc3MzI2NTQ0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["Satin"],
    color: "Ruby Red",
    inStock: false,
    category: "Cocktail"
  },
  {
    id: "6",
    name: "Azura Satin",
    price: 390,
    description: "A stunning satin dress in rich cerulean blue. The sleek, minimalist design with a subtle cowl neck creates an air of understated luxury, perfect for upscale events and formal dinners.",
    image: "https://images.unsplash.com/photo-1704775983177-8ae543524081?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRpbiUyMGJsdWUlMjBkcmVzcyUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3NzMyNjU0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: ["S", "M", "L"],
    materials: ["Satin"],
    color: "Cerulean",
    inStock: true,
    category: "Evening Wear"
  },
  {
    id: "7",
    name: "Verdana Wrap",
    price: 255,
    description: "A refreshing green wrap dress with a flattering wrap silhouette. The adjustable tie waist and deep V-neckline offer a versatile and feminine look that transitions seamlessly from day to evening.",
    image: "https://images.unsplash.com/photo-1636545659284-0481a5aab979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHdyYXAlMjBkcmVzcyUyMHdvbWFuJTIwc3ByaW5nfGVufDF8fHx8MTc3MzI2NTQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: ["XS", "S", "M", "L", "XL"],
    materials: ["Chiffon"],
    color: "Sage Green",
    inStock: true,
    category: "Day Wear"
  }
];

export const materials = [
  { id: "silk", name: "Silk", description: "Luxuriously soft & lustrous", thumbnail: "bg-gradient-to-br from-amber-50 to-amber-100" },
  { id: "chiffon", name: "Chiffon", description: "Light & flowing", thumbnail: "bg-gradient-to-br from-blue-50 to-blue-100" },
  { id: "satin", name: "Satin", description: "Smooth & shiny finish", thumbnail: "bg-gradient-to-br from-pink-50 to-pink-100" },
  { id: "lace", name: "Lace", description: "Romantic & intricate", thumbnail: "bg-gradient-to-br from-gray-50 to-gray-100" },
  { id: "cotton", name: "Cotton", description: "Comfortable & breathable", thumbnail: "bg-gradient-to-br from-green-50 to-green-100" }
];

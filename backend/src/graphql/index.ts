import { buildSchema, GraphQLSchema } from "graphql";
import * as store from "../store";
import * as reviewStore from "../stores/reviews";

const typeDefs = `
  type Dress {
    id: ID!
    name: String!
    price: Float!
    material: String!
    sizes: [String!]!
    stockQuantity: Int!
    description: String!
    imageUrl: String!
  }

  type DressPage {
    data: [Dress!]!
    page: Int!
    limit: Int!
    total: Int!
    totalPages: Int!
  }

  type MaterialCount {
    Silk: Int!
    Chiffon: Int!
    Satin: Int!
    Lace: Int!
    Cotton: Int!
  }

  type SizeCount {
    XS: Int!
    S: Int!
    M: Int!
    L: Int!
    XL: Int!
  }

  type DressStats {
    totalDresses: Int!
    totalStock: Int!
    averagePrice: Float!
    outOfStock: Int!
    byMaterial: MaterialCount!
    bySize: SizeCount!
  }

  type Review {
    id: ID!
    dressId: ID!
    author: String!
    rating: Int!
    comment: String!
    createdAt: String!
  }

  type ReviewDistribution {
    one: Int!
    two: Int!
    three: Int!
    four: Int!
    five: Int!
  }

  type ReviewStats {
    count: Int!
    averageRating: Float!
    distribution: ReviewDistribution!
  }

  input DressInput {
    name: String!
    price: Float!
    material: String!
    sizes: [String!]!
    stockQuantity: Int!
    description: String!
    imageUrl: String!
  }

  input ReviewInput {
    author: String!
    rating: Int!
    comment: String!
  }

  type Query {
    dresses(page: Int, limit: Int): DressPage!
    dress(id: ID!): Dress
    dressStats: DressStats!
    reviews(dressId: ID!): [Review!]!
    reviewStats(dressId: ID!): ReviewStats!
  }

  type Mutation {
    createDress(input: DressInput!): Dress!
    updateDress(id: ID!, input: DressInput!): Dress
    deleteDress(id: ID!): Boolean!
    createReview(dressId: ID!, input: ReviewInput!): Review!
    updateReview(id: ID!, input: ReviewInput!): Review
    deleteReview(id: ID!): Boolean!
  }
`;

const rootValue = {
  dresses({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    const all = store.getAll();
    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const data = all.slice((page - 1) * limit, page * limit);
    return { data, page, limit, total, totalPages };
  },

  dress({ id }: { id: string }) {
    return store.getById(id) ?? null;
  },

  dressStats() {
    const all = store.getAll();
    const byMaterial = Object.fromEntries(store.MATERIALS.map((m) => [m, 0])) as Record<string, number>;
    const bySize = Object.fromEntries(store.SIZES.map((s) => [s, 0])) as Record<string, number>;
    let totalStock = 0;
    let totalPrice = 0;
    let outOfStock = 0;
    for (const d of all) {
      totalStock += d.stockQuantity;
      totalPrice += d.price;
      if (d.stockQuantity === 0) outOfStock++;
      byMaterial[d.material] = (byMaterial[d.material] ?? 0) + 1;
      for (const s of d.sizes) bySize[s] = (bySize[s] ?? 0) + 1;
    }
    return {
      totalDresses: all.length,
      totalStock,
      averagePrice: all.length > 0 ? Math.round(totalPrice / all.length) : 0,
      outOfStock,
      byMaterial: {
        Silk: byMaterial["Silk"],
        Chiffon: byMaterial["Chiffon"],
        Satin: byMaterial["Satin"],
        Lace: byMaterial["Lace"],
        Cotton: byMaterial["Cotton"],
      },
      bySize: {
        XS: bySize["XS"],
        S: bySize["S"],
        M: bySize["M"],
        L: bySize["L"],
        XL: bySize["XL"],
      },
    };
  },

  reviews({ dressId }: { dressId: string }) {
    return reviewStore.getByDressId(dressId);
  },

  reviewStats({ dressId }: { dressId: string }) {
    const stats = reviewStore.getStats(dressId);
    return {
      count: stats.count,
      averageRating: stats.averageRating,
      distribution: {
        one: stats.distribution[1] ?? 0,
        two: stats.distribution[2] ?? 0,
        three: stats.distribution[3] ?? 0,
        four: stats.distribution[4] ?? 0,
        five: stats.distribution[5] ?? 0,
      },
    };
  },

  createDress({ input }: { input: Parameters<typeof store.create>[0] }) {
    return store.create(input);
  },

  updateDress({ id, input }: { id: string; input: Parameters<typeof store.create>[0] }) {
    return store.update(id, input) ?? null;
  },

  deleteDress({ id }: { id: string }) {
    return store.remove(id);
  },

  createReview({ dressId, input }: { dressId: string; input: { author: string; rating: number; comment: string } }) {
    return reviewStore.create({ dressId, ...input });
  },

  updateReview({ id, input }: { id: string; input: { author: string; rating: number; comment: string } }) {
    return reviewStore.update(id, input) ?? null;
  },

  deleteReview({ id }: { id: string }) {
    return reviewStore.remove(id);
  },
};

export const schema: GraphQLSchema = buildSchema(typeDefs);
export { rootValue };

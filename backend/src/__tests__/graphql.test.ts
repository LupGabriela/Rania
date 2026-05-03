import request from "supertest";
import app from "../app";
import * as store from "../store";
import * as reviewStore from "../stores/reviews";

const VALID_DRESS = {
  name: "Test Dress",
  price: 1500,
  material: "Silk",
  sizes: ["S", "M"],
  stockQuantity: 10,
  description: "A beautiful test dress for automated testing.",
  imageUrl: "https://example.com/dress.jpg",
};

const gql = (query: string) =>
  request(app)
    .post("/graphql")
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ query }));

beforeEach(() => {
  store.reset();
  reviewStore.reset();
});

// ── Query: dresses ────────────────────────────────────────────────────────────

describe("GraphQL Query: dresses", () => {
  it("returns paginated list with correct shape", async () => {
    const res = await gql("{ dresses(page: 1, limit: 10) { data { id name price material sizes stockQuantity description imageUrl } total totalPages page limit } }");
    expect(res.status).toBe(200);
    const { dresses } = res.body.data;
    expect(dresses).toHaveProperty("data");
    expect(dresses).toHaveProperty("total");
    expect(dresses).toHaveProperty("totalPages");
    expect(Array.isArray(dresses.data)).toBe(true);
  });

  it("respects page and limit parameters", async () => {
    const before = await gql("{ dresses(page: 1, limit: 100) { total } }");
    const initialTotal: number = before.body.data.dresses.total;
    store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    store.create({ ...VALID_DRESS, name: "Second Dress" } as Parameters<typeof store.create>[0]);
    const res = await gql("{ dresses(page: 1, limit: 1) { data { id } total } }");
    expect(res.body.data.dresses.data).toHaveLength(1);
    expect(res.body.data.dresses.total).toBe(initialTotal + 2);
  });

  it("returns second page correctly", async () => {
    for (let i = 0; i < 4; i++) {
      store.create({ ...VALID_DRESS, name: `Dress ${i}` } as Parameters<typeof store.create>[0]);
    }
    const page1 = await gql("{ dresses(page: 1, limit: 2) { data { id } } }");
    const page2 = await gql("{ dresses(page: 2, limit: 2) { data { id } } }");
    const ids1 = page1.body.data.dresses.data.map((d: { id: string }) => d.id);
    const ids2 = page2.body.data.dresses.data.map((d: { id: string }) => d.id);
    expect(ids1[0]).not.toBe(ids2[0]);
  });
});

// ── Query: dress ──────────────────────────────────────────────────────────────

describe("GraphQL Query: dress", () => {
  it("returns a dress by id", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const res = await gql(`{ dress(id: "${dress.id}") { id name price } }`);
    expect(res.status).toBe(200);
    expect(res.body.data.dress.id).toBe(dress.id);
    expect(res.body.data.dress.name).toBe(VALID_DRESS.name);
  });

  it("returns null for unknown id", async () => {
    const res = await gql(`{ dress(id: "nonexistent") { id name } }`);
    expect(res.status).toBe(200);
    expect(res.body.data.dress).toBeNull();
  });
});

// ── Query: dressStats ─────────────────────────────────────────────────────────

describe("GraphQL Query: dressStats", () => {
  it("returns correct shape with all fields", async () => {
    const res = await gql("{ dressStats { totalDresses totalStock averagePrice outOfStock byMaterial { Silk Chiffon Satin Lace Cotton } bySize { XS S M L XL } } }");
    expect(res.status).toBe(200);
    const stats = res.body.data.dressStats;
    expect(stats).toHaveProperty("totalDresses");
    expect(stats).toHaveProperty("totalStock");
    expect(stats).toHaveProperty("averagePrice");
    expect(stats).toHaveProperty("outOfStock");
    expect(stats.byMaterial).toHaveProperty("Silk");
    expect(stats.bySize).toHaveProperty("XS");
  });

  it("averagePrice is a positive number with seed data", async () => {
    const res = await gql("{ dressStats { totalDresses averagePrice } }");
    expect(res.body.data.dressStats.totalDresses).toBeGreaterThan(0);
    expect(res.body.data.dressStats.averagePrice).toBeGreaterThan(0);
  });

  it("counts out-of-stock dresses correctly after adding one", async () => {
    const before = await gql("{ dressStats { outOfStock } }");
    const initialOutOfStock: number = before.body.data.dressStats.outOfStock;
    store.create({ ...VALID_DRESS, stockQuantity: 0 } as Parameters<typeof store.create>[0]);
    const res = await gql("{ dressStats { outOfStock } }");
    expect(res.body.data.dressStats.outOfStock).toBe(initialOutOfStock + 1);
  });
});

// ── Mutation: createDress ─────────────────────────────────────────────────────

describe("GraphQL Mutation: createDress", () => {
  it("creates a dress and returns it", async () => {
    const res = await gql(`
      mutation {
        createDress(input: {
          name: "Test Dress",
          price: 1500,
          material: "Silk",
          sizes: ["S", "M"],
          stockQuantity: 10,
          description: "A beautiful test dress for automated testing.",
          imageUrl: "https://example.com/dress.jpg"
        }) { id name price material }
      }
    `);
    expect(res.status).toBe(200);
    expect(res.body.data.createDress).toHaveProperty("id");
    expect(res.body.data.createDress.name).toBe("Test Dress");
    expect(res.body.data.createDress.material).toBe("Silk");
  });
});

// ── Mutation: updateDress ─────────────────────────────────────────────────────

describe("GraphQL Mutation: updateDress", () => {
  it("updates an existing dress", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const res = await gql(`
      mutation {
        updateDress(id: "${dress.id}", input: {
          name: "Updated Dress",
          price: 2000,
          material: "Satin",
          sizes: ["M", "L"],
          stockQuantity: 5,
          description: "A beautiful test dress for automated testing.",
          imageUrl: "https://example.com/dress.jpg"
        }) { id name price }
      }
    `);
    expect(res.status).toBe(200);
    expect(res.body.data.updateDress.name).toBe("Updated Dress");
    expect(res.body.data.updateDress.price).toBe(2000);
  });

  it("returns null for unknown id", async () => {
    const res = await gql(`
      mutation {
        updateDress(id: "nonexistent", input: {
          name: "X",
          price: 100,
          material: "Silk",
          sizes: ["S"],
          stockQuantity: 1,
          description: "A beautiful test dress for automated testing.",
          imageUrl: "https://example.com/dress.jpg"
        }) { id }
      }
    `);
    expect(res.status).toBe(200);
    expect(res.body.data.updateDress).toBeNull();
  });
});

// ── Mutation: deleteDress ─────────────────────────────────────────────────────

describe("GraphQL Mutation: deleteDress", () => {
  it("deletes a dress and returns true", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const res = await gql(`mutation { deleteDress(id: "${dress.id}") }`);
    expect(res.status).toBe(200);
    expect(res.body.data.deleteDress).toBe(true);
    expect(store.getAll().find((d) => d.id === dress.id)).toBeUndefined();
  });

  it("returns false for unknown id", async () => {
    const res = await gql(`mutation { deleteDress(id: "nonexistent") }`);
    expect(res.status).toBe(200);
    expect(res.body.data.deleteDress).toBe(false);
  });
});

// ── Query: reviews ────────────────────────────────────────────────────────────

describe("GraphQL Query: reviews", () => {
  it("returns reviews for a dress", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    reviewStore.create({ dressId: dress.id, author: "Ana Maria", rating: 5, comment: "Gorgeous!" });
    const res = await gql(`{ reviews(dressId: "${dress.id}") { id dressId author rating comment createdAt } }`);
    expect(res.status).toBe(200);
    expect(res.body.data.reviews).toHaveLength(1);
    expect(res.body.data.reviews[0].author).toBe("Ana Maria");
    expect(res.body.data.reviews[0].dressId).toBe(dress.id);
  });

  it("returns empty array when dress has no reviews", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const res = await gql(`{ reviews(dressId: "${dress.id}") { id } }`);
    expect(res.body.data.reviews).toEqual([]);
  });
});

// ── Query: reviewStats ────────────────────────────────────────────────────────

describe("GraphQL Query: reviewStats", () => {
  it("returns zero stats when no reviews", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const res = await gql(`{ reviewStats(dressId: "${dress.id}") { count averageRating distribution { one two three four five } } }`);
    expect(res.status).toBe(200);
    const stats = res.body.data.reviewStats;
    expect(stats.count).toBe(0);
    expect(stats.averageRating).toBe(0);
  });

  it("calculates averageRating and distribution correctly", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    reviewStore.create({ dressId: dress.id, author: "Ana", rating: 4, comment: "Great dress!" });
    reviewStore.create({ dressId: dress.id, author: "Ion", rating: 2, comment: "Average dress." });
    const res = await gql(`{ reviewStats(dressId: "${dress.id}") { count averageRating distribution { one two three four five } } }`);
    const stats = res.body.data.reviewStats;
    expect(stats.count).toBe(2);
    expect(stats.averageRating).toBe(3);
    expect(stats.distribution.four).toBe(1);
    expect(stats.distribution.two).toBe(1);
    expect(stats.distribution.one).toBe(0);
  });
});

// ── Mutation: createReview ────────────────────────────────────────────────────

describe("GraphQL Mutation: createReview", () => {
  it("creates a review for a dress", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const res = await gql(`
      mutation {
        createReview(dressId: "${dress.id}", input: {
          author: "Ana Maria",
          rating: 5,
          comment: "Absolutely gorgeous!"
        }) { id dressId author rating comment createdAt }
      }
    `);
    expect(res.status).toBe(200);
    const review = res.body.data.createReview;
    expect(review).toHaveProperty("id");
    expect(review.dressId).toBe(dress.id);
    expect(review.rating).toBe(5);
    expect(review.author).toBe("Ana Maria");
  });
});

// ── Mutation: updateReview ────────────────────────────────────────────────────

describe("GraphQL Mutation: updateReview", () => {
  it("updates an existing review", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const review = reviewStore.create({ dressId: dress.id, author: "Ana", rating: 3, comment: "Nice dress!" });
    const res = await gql(`
      mutation {
        updateReview(id: "${review.id}", input: {
          author: "Ana Updated",
          rating: 4,
          comment: "Even nicer dress!"
        }) { id author rating }
      }
    `);
    expect(res.status).toBe(200);
    expect(res.body.data.updateReview.author).toBe("Ana Updated");
    expect(res.body.data.updateReview.rating).toBe(4);
  });

  it("returns null for unknown review id", async () => {
    const res = await gql(`
      mutation {
        updateReview(id: "nonexistent", input: {
          author: "Ana",
          rating: 4,
          comment: "Nice dress!"
        }) { id }
      }
    `);
    expect(res.status).toBe(200);
    expect(res.body.data.updateReview).toBeNull();
  });
});

// ── Mutation: deleteReview ────────────────────────────────────────────────────

describe("GraphQL Mutation: deleteReview", () => {
  it("deletes a review and returns true", async () => {
    const dress = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
    const review = reviewStore.create({ dressId: dress.id, author: "Ana", rating: 5, comment: "Great dress!" });
    const res = await gql(`mutation { deleteReview(id: "${review.id}") }`);
    expect(res.status).toBe(200);
    expect(res.body.data.deleteReview).toBe(true);
  });

  it("returns false for unknown review id", async () => {
    const res = await gql(`mutation { deleteReview(id: "nonexistent") }`);
    expect(res.status).toBe(200);
    expect(res.body.data.deleteReview).toBe(false);
  });
});

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

const VALID_REVIEW = {
  author: "Ana Maria",
  rating: 5,
  comment: "Absolutely gorgeous dress!",
};

let dressId: string;

beforeEach(() => {
  store.reset();
  reviewStore.reset();
  // Create a dress to attach reviews to
  const res = store.create(VALID_DRESS as Parameters<typeof store.create>[0]);
  dressId = res.id;
});

// ── GET /api/dresses/:dressId/reviews ────────────────────────────────────────

describe("GET /api/dresses/:dressId/reviews", () => {
  it("returns empty array when no reviews", async () => {
    const res = await request(app).get(`/api/dresses/${dressId}/reviews`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns reviews for a dress", async () => {
    await request(app).post(`/api/dresses/${dressId}/reviews`).send(VALID_REVIEW);
    const res = await request(app).get(`/api/dresses/${dressId}/reviews`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].author).toBe(VALID_REVIEW.author);
  });

  it("returns 404 for unknown dress", async () => {
    const res = await request(app).get("/api/dresses/unknown-id/reviews");
    expect(res.status).toBe(404);
  });
});

// ── GET /api/dresses/:dressId/reviews/stats ──────────────────────────────────

describe("GET /api/dresses/:dressId/reviews/stats", () => {
  it("returns zero stats when no reviews", async () => {
    const res = await request(app).get(`/api/dresses/${dressId}/reviews/stats`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.averageRating).toBe(0);
  });

  it("calculates average rating correctly", async () => {
    await request(app).post(`/api/dresses/${dressId}/reviews`).send({ ...VALID_REVIEW, rating: 4 });
    await request(app).post(`/api/dresses/${dressId}/reviews`).send({ ...VALID_REVIEW, rating: 2 });
    const res = await request(app).get(`/api/dresses/${dressId}/reviews/stats`);
    expect(res.body.count).toBe(2);
    expect(res.body.averageRating).toBe(3);
  });

  it("returns 404 for unknown dress", async () => {
    const res = await request(app).get("/api/dresses/unknown-id/reviews/stats");
    expect(res.status).toBe(404);
  });
});

// ── POST /api/dresses/:dressId/reviews ───────────────────────────────────────

describe("POST /api/dresses/:dressId/reviews", () => {
  it("creates a review and returns 201", async () => {
    const res = await request(app).post(`/api/dresses/${dressId}/reviews`).send(VALID_REVIEW);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.dressId).toBe(dressId);
    expect(res.body.author).toBe(VALID_REVIEW.author);
    expect(res.body.rating).toBe(VALID_REVIEW.rating);
    expect(res.body).toHaveProperty("createdAt");
  });

  it("returns 404 for unknown dress", async () => {
    const res = await request(app).post("/api/dresses/unknown-id/reviews").send(VALID_REVIEW);
    expect(res.status).toBe(404);
  });

  it("returns 400 when author is missing", async () => {
    const { author: _a, ...body } = VALID_REVIEW;
    const res = await request(app).post(`/api/dresses/${dressId}/reviews`).send(body);
    expect(res.status).toBe(400);
  });

  it("returns 400 when rating is out of range", async () => {
    const res = await request(app).post(`/api/dresses/${dressId}/reviews`).send({ ...VALID_REVIEW, rating: 6 });
    expect(res.status).toBe(400);
  });

  it("returns 400 when rating is 0", async () => {
    const res = await request(app).post(`/api/dresses/${dressId}/reviews`).send({ ...VALID_REVIEW, rating: 0 });
    expect(res.status).toBe(400);
  });

  it("returns 400 when comment is too short", async () => {
    const res = await request(app).post(`/api/dresses/${dressId}/reviews`).send({ ...VALID_REVIEW, comment: "Ok" });
    expect(res.status).toBe(400);
  });
});

// ── PUT /api/reviews/:id ──────────────────────────────────────────────────────

describe("PUT /api/reviews/:id", () => {
  it("updates a review", async () => {
    const created = await request(app).post(`/api/dresses/${dressId}/reviews`).send(VALID_REVIEW);
    const updated = { author: "Maria Ion", rating: 3, comment: "Nice dress, good quality." };
    const res = await request(app).put(`/api/reviews/${created.body.id}`).send(updated);
    expect(res.status).toBe(200);
    expect(res.body.author).toBe("Maria Ion");
    expect(res.body.rating).toBe(3);
  });

  it("returns 404 for unknown review", async () => {
    const res = await request(app).put("/api/reviews/unknown-id").send(VALID_REVIEW);
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid rating", async () => {
    const created = await request(app).post(`/api/dresses/${dressId}/reviews`).send(VALID_REVIEW);
    const res = await request(app).put(`/api/reviews/${created.body.id}`).send({ ...VALID_REVIEW, rating: 10 });
    expect(res.status).toBe(400);
  });
});

// ── DELETE /api/reviews/:id ───────────────────────────────────────────────────

describe("DELETE /api/reviews/:id", () => {
  it("deletes a review and returns 204", async () => {
    const created = await request(app).post(`/api/dresses/${dressId}/reviews`).send(VALID_REVIEW);
    const res = await request(app).delete(`/api/reviews/${created.body.id}`);
    expect(res.status).toBe(204);
  });

  it("review is gone after deletion", async () => {
    const created = await request(app).post(`/api/dresses/${dressId}/reviews`).send(VALID_REVIEW);
    await request(app).delete(`/api/reviews/${created.body.id}`);
    const list = await request(app).get(`/api/dresses/${dressId}/reviews`);
    expect(list.body).toHaveLength(0);
  });

  it("returns 404 for unknown review", async () => {
    const res = await request(app).delete("/api/reviews/does-not-exist");
    expect(res.status).toBe(404);
  });
});

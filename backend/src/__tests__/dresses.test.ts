import request from "supertest";
import app from "../app";
import * as store from "../store";

const VALID_DRESS = {
  name: "Test Dress",
  price: 1500,
  material: "Silk",
  sizes: ["S", "M"],
  stockQuantity: 10,
  description: "A beautiful test dress for automated testing.",
  imageUrl: "https://example.com/dress.jpg",
};

beforeEach(() => {
  store.reset();
});

// ── GET /api/dresses ──────────────────────────────────────────────────────────

describe("GET /api/dresses", () => {
  it("returns a paginated list with default page=1 limit=10", async () => {
    const res = await request(app).get("/api/dresses");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("page", 1);
    expect(res.body).toHaveProperty("limit", 10);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("totalPages");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("respects custom page and limit", async () => {
    const res = await request(app).get("/api/dresses?page=1&limit=3");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
    expect(res.body.limit).toBe(3);
  });

  it("returns second page correctly", async () => {
    const page1 = await request(app).get("/api/dresses?page=1&limit=3");
    const page2 = await request(app).get("/api/dresses?page=2&limit=3");
    expect(page1.body.data[0].id).not.toBe(page2.body.data[0]?.id);
  });

  it("returns 400 for invalid page parameter", async () => {
    const res = await request(app).get("/api/dresses?page=0");
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-numeric page", async () => {
    const res = await request(app).get("/api/dresses?page=abc");
    expect(res.status).toBe(400);
  });

  it("returns 400 for limit exceeding 100", async () => {
    const res = await request(app).get("/api/dresses?limit=200");
    expect(res.status).toBe(400);
  });
});

// ── GET /api/dresses/stats ───────────────────────────────────────────────────

describe("GET /api/dresses/stats", () => {
  it("returns statistics with correct shape", async () => {
    const res = await request(app).get("/api/dresses/stats");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalDresses");
    expect(res.body).toHaveProperty("totalStock");
    expect(res.body).toHaveProperty("averagePrice");
    expect(res.body).toHaveProperty("outOfStock");
    expect(res.body).toHaveProperty("byMaterial");
    expect(res.body).toHaveProperty("bySize");
  });

  it("totalDresses matches the actual count", async () => {
    const list = await request(app).get("/api/dresses?limit=100");
    const stats = await request(app).get("/api/dresses/stats");
    expect(stats.body.totalDresses).toBe(list.body.total);
  });

  it("counts out-of-stock dresses correctly", async () => {
    const res = await request(app).get("/api/dresses/stats");
    const all = store.getAll();
    const expected = all.filter((d) => d.stockQuantity === 0).length;
    expect(res.body.outOfStock).toBe(expected);
  });

  it("byMaterial contains all material keys", async () => {
    const res = await request(app).get("/api/dresses/stats");
    expect(res.body.byMaterial).toHaveProperty("Silk");
    expect(res.body.byMaterial).toHaveProperty("Chiffon");
    expect(res.body.byMaterial).toHaveProperty("Satin");
    expect(res.body.byMaterial).toHaveProperty("Lace");
    expect(res.body.byMaterial).toHaveProperty("Cotton");
  });

  it("bySize contains all size keys", async () => {
    const res = await request(app).get("/api/dresses/stats");
    expect(res.body.bySize).toHaveProperty("XS");
    expect(res.body.bySize).toHaveProperty("S");
    expect(res.body.bySize).toHaveProperty("M");
    expect(res.body.bySize).toHaveProperty("L");
    expect(res.body.bySize).toHaveProperty("XL");
  });

  it("updates stats after adding a new dress", async () => {
    const before = await request(app).get("/api/dresses/stats");
    await request(app).post("/api/dresses").send(VALID_DRESS);
    const after = await request(app).get("/api/dresses/stats");
    expect(after.body.totalDresses).toBe(before.body.totalDresses + 1);
  });
});

// ── GET /api/dresses/:id ─────────────────────────────────────────────────────

describe("GET /api/dresses/:id", () => {
  it("returns a dress by id", async () => {
    const created = await request(app).post("/api/dresses").send(VALID_DRESS);
    const res = await request(app).get(`/api/dresses/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.name).toBe(VALID_DRESS.name);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/dresses/nonexistent-id");
    expect(res.status).toBe(404);
  });
});

// ── POST /api/dresses ─────────────────────────────────────────────────────────

describe("POST /api/dresses", () => {
  it("creates a dress and returns 201", async () => {
    const res = await request(app).post("/api/dresses").send(VALID_DRESS);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(VALID_DRESS.name);
    expect(res.body.price).toBe(VALID_DRESS.price);
  });

  it("assigns a unique id to each created dress", async () => {
    const r1 = await request(app).post("/api/dresses").send(VALID_DRESS);
    const r2 = await request(app).post("/api/dresses").send(VALID_DRESS);
    expect(r1.body.id).not.toBe(r2.body.id);
  });

  it("returns 400 when name is missing", async () => {
    const { name: _name, ...body } = VALID_DRESS;
    const res = await request(app).post("/api/dresses").send(body);
    expect(res.status).toBe(400);
  });

  it("returns 400 when name is too short", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, name: "A" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when price is zero", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, price: 0 });
    expect(res.status).toBe(400);
  });

  it("returns 400 when price is negative", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, price: -100 });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid material", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, material: "Denim" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when sizes is empty array", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, sizes: [] });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid size value", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, sizes: ["XXL"] });
    expect(res.status).toBe(400);
  });

  it("returns 400 when stockQuantity is negative", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, stockQuantity: -1 });
    expect(res.status).toBe(400);
  });

  it("returns 400 when description is too short", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, description: "Short" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid imageUrl", async () => {
    const res = await request(app).post("/api/dresses").send({ ...VALID_DRESS, imageUrl: "not-a-url" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is empty", async () => {
    const res = await request(app).post("/api/dresses").send({});
    expect(res.status).toBe(400);
  });
});

// ── PUT /api/dresses/:id ──────────────────────────────────────────────────────

describe("PUT /api/dresses/:id", () => {
  it("updates an existing dress", async () => {
    const created = await request(app).post("/api/dresses").send(VALID_DRESS);
    const updated = { ...VALID_DRESS, name: "Updated Name", price: 2000 };
    const res = await request(app).put(`/api/dresses/${created.body.id}`).send(updated);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Name");
    expect(res.body.price).toBe(2000);
    expect(res.body.id).toBe(created.body.id);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).put("/api/dresses/unknown-id").send(VALID_DRESS);
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid update body", async () => {
    const created = await request(app).post("/api/dresses").send(VALID_DRESS);
    const res = await request(app).put(`/api/dresses/${created.body.id}`).send({ ...VALID_DRESS, price: -1 });
    expect(res.status).toBe(400);
  });

  it("persists the update in subsequent GET", async () => {
    const created = await request(app).post("/api/dresses").send(VALID_DRESS);
    await request(app).put(`/api/dresses/${created.body.id}`).send({ ...VALID_DRESS, name: "Persisted Name" });
    const res = await request(app).get(`/api/dresses/${created.body.id}`);
    expect(res.body.name).toBe("Persisted Name");
  });
});

// ── DELETE /api/dresses/:id ───────────────────────────────────────────────────

describe("DELETE /api/dresses/:id", () => {
  it("deletes an existing dress and returns 204", async () => {
    const created = await request(app).post("/api/dresses").send(VALID_DRESS);
    const res = await request(app).delete(`/api/dresses/${created.body.id}`);
    expect(res.status).toBe(204);
  });

  it("dress is gone after deletion", async () => {
    const created = await request(app).post("/api/dresses").send(VALID_DRESS);
    await request(app).delete(`/api/dresses/${created.body.id}`);
    const res = await request(app).get(`/api/dresses/${created.body.id}`);
    expect(res.status).toBe(404);
  });

  it("returns 404 when deleting non-existent id", async () => {
    const res = await request(app).delete("/api/dresses/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("decreases total count after deletion", async () => {
    const before = await request(app).get("/api/dresses?limit=100");
    const created = await request(app).post("/api/dresses").send(VALID_DRESS);
    await request(app).delete(`/api/dresses/${created.body.id}`);
    const after = await request(app).get("/api/dresses?limit=100");
    expect(after.body.total).toBe(before.body.total);
  });
});

// ── GET /api/health ───────────────────────────────────────────────────────────

describe("GET /api/health", () => {
  it("returns ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

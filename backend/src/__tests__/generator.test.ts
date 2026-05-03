import request from "supertest";
import app from "../app";
import * as store from "../store";
import * as websocket from "../websocket";

beforeEach(() => {
  store.reset();
});

afterEach(async () => {
  // Always stop the generator after each test
  await request(app).post("/api/generator/stop").catch(() => {});
});

describe("GET /api/generator/status", () => {
  it("returns not running initially", async () => {
    const res = await request(app).get("/api/generator/status");
    expect(res.status).toBe(200);
    expect(res.body.running).toBe(false);
  });
});

describe("POST /api/generator/start", () => {
  it("starts the generator and returns 200", async () => {
    const res = await request(app).post("/api/generator/start").send({ interval: 60000 });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Generator started");
    expect(res.body).toHaveProperty("intervalMs");
  });

  it("returns 400 if already running", async () => {
    await request(app).post("/api/generator/start").send({ interval: 60000 });
    const res = await request(app).post("/api/generator/start").send({ interval: 60000 });
    expect(res.status).toBe(400);
  });

  it("status shows running after start", async () => {
    await request(app).post("/api/generator/start").send({ interval: 60000 });
    const res = await request(app).get("/api/generator/status");
    expect(res.body.running).toBe(true);
  });
});

// ── Interval callback (fake timers) ──────────────────────────────────────────

describe("Generator interval callback", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("generates a dress and broadcasts it when the timer fires", async () => {
    jest.useFakeTimers();
    const broadcastSpy = jest.spyOn(websocket, "broadcast").mockImplementation(() => {});

    const countBefore = store.getAll().length;
    const res = await request(app).post("/api/generator/start").send({ interval: 1000 });
    expect(res.status).toBe(200);

    jest.advanceTimersByTime(1001);

    expect(broadcastSpy).toHaveBeenCalledWith(
      "dress-added",
      expect.objectContaining({ name: expect.any(String) })
    );
    expect(store.getAll().length).toBe(countBefore + 1);

    broadcastSpy.mockRestore();
  });
});

describe("POST /api/generator/stop", () => {
  it("stops the generator and returns 200", async () => {
    await request(app).post("/api/generator/start").send({ interval: 60000 });
    const res = await request(app).post("/api/generator/stop");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Generator stopped");
  });

  it("returns 400 if not running", async () => {
    const res = await request(app).post("/api/generator/stop");
    expect(res.status).toBe(400);
  });

  it("status shows not running after stop", async () => {
    await request(app).post("/api/generator/start").send({ interval: 60000 });
    await request(app).post("/api/generator/stop");
    const res = await request(app).get("/api/generator/status");
    expect(res.body.running).toBe(false);
  });
});

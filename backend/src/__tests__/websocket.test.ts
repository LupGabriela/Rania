import { createServer, Server } from "http";
import { WebSocket } from "ws";
import { setupWebSocket, broadcast } from "../websocket";

let server: Server;
let port: number;

beforeAll((done) => {
  server = createServer();
  setupWebSocket(server);
  server.listen(0, () => {
    port = (server.address() as { port: number }).port;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

// ── setupWebSocket ────────────────────────────────────────────────────────────

describe("setupWebSocket", () => {
  it("sends a connected greeting to newly connected clients", (done) => {
    const client = new WebSocket(`ws://localhost:${port}`);
    client.once("message", (data) => {
      const msg = JSON.parse(data.toString()) as { type: string; message: string };
      expect(msg.type).toBe("connected");
      expect(msg.message).toBe("Connected to Rania live updates");
      client.close();
      done();
    });
  });
});

// ── broadcast ─────────────────────────────────────────────────────────────────

describe("broadcast", () => {
  it("delivers a typed message to all open clients", (done) => {
    const client = new WebSocket(`ws://localhost:${port}`);

    // Use nested once() so no stale handler remains after the test completes
    client.once("message", () => {
      // skip the initial "connected" greeting
      client.once("message", (data) => {
        const msg = JSON.parse(data.toString()) as { type: string; payload: unknown };
        expect(msg.type).toBe("test-event");
        expect(msg.payload).toEqual({ hello: "world" });
        client.close();
        done();
      });
      broadcast("test-event", { hello: "world" });
    });
  });

  it("does not throw when called with wss initialised", () => {
    expect(() => broadcast("noop", null)).not.toThrow();
  });
});

import http from "http";
import app from "./app";
import { setupWebSocket } from "./websocket";

const PORT = process.env.PORT ?? 3001;

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Rania API   → http://localhost:${PORT}`);
  console.log(`GraphQL     → http://localhost:${PORT}/graphql`);
  console.log(`WebSocket   → ws://localhost:${PORT}`);
});

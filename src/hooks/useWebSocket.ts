import { useEffect, useRef } from "react";
import type { DressRecord } from "../data/apiClient";

interface WsMessage {
  type: string;
  payload?: unknown;
}

interface UseWebSocketOptions {
  onDressAdded?: (dress: DressRecord) => void;
}

export function useWebSocket({ onDressAdded }: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket("ws://localhost:3001");
      wsRef.current = ws;

      ws.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data as string) as WsMessage;
          if (msg.type === "dress-added" && onDressAdded) {
            onDressAdded(msg.payload as DressRecord);
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        // Reconnect after 3 seconds
        setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      wsRef.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

import { useState, useEffect, useCallback } from "react";
import * as api from "../data/apiClient";
import type { DressRecord } from "../data/apiClient";
import * as queue from "../data/offlineQueue";
import { v4 as uuidv4 } from "uuid";

export function useDresses() {
  const [dresses, setDresses] = useState<DressRecord[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const refreshFromServer = useCallback(async () => {
    try {
      // Fetch all pages
      const first = await api.fetchDresses(1, 100);
      const all = first.data;
      setDresses(all);
      queue.setCachedDresses(all);
    } catch {
      // Offline fallback
      setDresses(queue.getCachedDresses());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshFromServer();
  }, [refreshFromServer]);

  // Online/offline detection
  useEffect(() => {
    const goOnline = async () => {
      setIsOnline(true);
      await queue.flushQueue();
      setPendingCount(0);
      await refreshFromServer();
    };
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [refreshFromServer]);

  // ── CRUD operations ───────────────────────────────────────────────────────

  const add = useCallback(async (data: Omit<DressRecord, "id">): Promise<DressRecord> => {
    if (isOnline) {
      const created = await api.createDress(data);
      setDresses((prev) => [...prev, created]);
      queue.setCachedDresses([...queue.getCachedDresses(), created]);
      return created;
    } else {
      const tempId = `offline-${uuidv4()}`;
      const local: DressRecord = { id: tempId, ...data };
      queue.enqueue({ type: "create", tempId, data });
      setPendingCount((c) => c + 1);
      setDresses((prev) => [...prev, local]);
      queue.setCachedDresses([...queue.getCachedDresses(), local]);
      return local;
    }
  }, [isOnline]);

  const update = useCallback(async (id: string, data: Omit<DressRecord, "id">): Promise<void> => {
    if (isOnline) {
      const updated = await api.updateDress(id, data);
      setDresses((prev) => prev.map((d) => (d.id === id ? updated : d)));
    } else {
      queue.enqueue({ type: "update", id, data });
      setPendingCount((c) => c + 1);
      setDresses((prev) => prev.map((d) => (d.id === id ? { id, ...data } : d)));
    }
  }, [isOnline]);

  const remove = useCallback(async (id: string): Promise<void> => {
    if (isOnline) {
      await api.deleteDress(id);
    } else {
      queue.enqueue({ type: "delete", id });
      setPendingCount((c) => c + 1);
    }
    setDresses((prev) => prev.filter((d) => d.id !== id));
  }, [isOnline]);

  const addFromServer = useCallback((dress: DressRecord) => {
    setDresses((prev) => {
      if (prev.find((d) => d.id === dress.id)) return prev;
      const next = [...prev, dress];
      queue.setCachedDresses(next);
      return next;
    });
  }, []);

  return { dresses, isOnline, isLoading, pendingCount, add, update, remove, addFromServer, refresh: refreshFromServer };
}

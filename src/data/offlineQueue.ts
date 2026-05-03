import type { DressRecord } from "./apiClient";
import * as api from "./apiClient";

type QueuedOp =
  | { type: "create"; tempId: string; data: Omit<DressRecord, "id"> }
  | { type: "update"; id: string; data: Omit<DressRecord, "id"> }
  | { type: "delete"; id: string };

const QUEUE_KEY = "rania_offline_queue";
const CACHE_KEY = "rania_dresses_cache";

// ── Queue persistence ─────────────────────────────────────────────────────────

function loadQueue(): QueuedOp[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]") as QueuedOp[];
  } catch {
    return [];
  }
}

function saveQueue(q: QueuedOp[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

export function enqueue(op: QueuedOp): void {
  const q = loadQueue();
  q.push(op);
  saveQueue(q);
}

export function queueLength(): number {
  return loadQueue().length;
}

// ── Dress cache ───────────────────────────────────────────────────────────────

export function getCachedDresses(): DressRecord[] {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "[]") as DressRecord[];
  } catch {
    return [];
  }
}

export function setCachedDresses(dresses: DressRecord[]): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(dresses));
}

// ── Sync when back online ─────────────────────────────────────────────────────

export async function flushQueue(): Promise<void> {
  const q = loadQueue();
  if (q.length === 0) return;

  const idMap = new Map<string, string>(); // tempId → real server id

  for (const op of q) {
    try {
      if (op.type === "create") {
        const created = await api.createDress(op.data);
        idMap.set(op.tempId, created.id);
      } else if (op.type === "update") {
        const realId = idMap.get(op.id) ?? op.id;
        await api.updateDress(realId, op.data);
      } else if (op.type === "delete") {
        const realId = idMap.get(op.id) ?? op.id;
        await api.deleteDress(realId);
      }
    } catch {
      // Skip failed ops — server may have diverged, fetch will reconcile
    }
  }

  saveQueue([]);
}

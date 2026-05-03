/**
 * RANIA — Cookie-based User Activity & Preference Monitor
 *
 * Tracks:
 *  - Page visits (with timestamps)
 *  - Last visited dress ID (preference)
 *  - Preferred material filter (preference)
 *  - Session start time
 *  - Total actions performed (add/edit/delete)
 *
 * All cookies are first-party, no external libs needed.
 * Expires: 7 days by default.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ActivityCookies {
  lastVisitedPage: string;
  lastVisitedDressId: string;
  preferredMaterial: string;
  sessionStart: string;
  pageViewCount: string;
  lastActionType: string; // "add" | "edit" | "delete" | ""
  visitedPages: string;   // JSON array of { path, timestamp }
}

export interface PageVisit {
  path: string;
  timestamp: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EXPIRES_DAYS = 7;

function getExpiry(): string {
  const d = new Date();
  d.setTime(d.getTime() + EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  return d.toUTCString();
}

/** Sets a cookie with a 7-day expiry. */
export function setCookie(name: string, value: string): void {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${getExpiry()}; path=/; SameSite=Lax`;
}

/** Reads a cookie by name. Returns empty string if not found. */
export function getCookie(name: string): string {
  const key = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");
  for (let c of cookies) {
    const trimmed = c.trim();
    if (trimmed.startsWith(key)) {
      return decodeURIComponent(trimmed.substring(key.length));
    }
  }
  return "";
}

/** Deletes a cookie by name. */
export function deleteCookie(name: string): void {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/** Reads all RANIA activity cookies as a typed object. */
export function getAllActivityCookies(): Partial<ActivityCookies> {
  return {
    lastVisitedPage:    getCookie("rania_last_page"),
    lastVisitedDressId: getCookie("rania_last_dress_id"),
    preferredMaterial:  getCookie("rania_preferred_material"),
    sessionStart:       getCookie("rania_session_start"),
    pageViewCount:      getCookie("rania_page_view_count"),
    lastActionType:     getCookie("rania_last_action"),
    visitedPages:       getCookie("rania_visited_pages"),
  };
}

// ── Activity Trackers ─────────────────────────────────────────────────────────

/** Called on every route change. Tracks last visited page and view count. */
export function trackPageVisit(path: string): void {
  // Last page
  setCookie("rania_last_page", path);

  // View count
  const current = parseInt(getCookie("rania_page_view_count") || "0", 10);
  setCookie("rania_page_view_count", String(current + 1));

  // Session start (only set once per session)
  if (!getCookie("rania_session_start")) {
    setCookie("rania_session_start", new Date().toISOString());
  }

  // History of visited pages (keep last 10)
  const raw = getCookie("rania_visited_pages");
  let history: PageVisit[] = [];
  try {
    history = raw ? JSON.parse(raw) : [];
  } catch {
    history = [];
  }
  history.push({ path, timestamp: new Date().toISOString() });
  if (history.length > 10) history = history.slice(-10);
  setCookie("rania_visited_pages", JSON.stringify(history));
}

/** Called when user views a dress detail. */
export function trackDressView(dressId: string): void {
  setCookie("rania_last_dress_id", dressId);
}

/** Called when user filters by material. */
export function trackMaterialPreference(material: string): void {
  if (material) setCookie("rania_preferred_material", material);
}

/** Called after a CRUD action in DressManager. */
export function trackDressAction(action: "add" | "edit" | "delete"): void {
  setCookie("rania_last_action", action);
}

/** Clears all RANIA activity cookies (e.g. on logout). */
export function clearActivityCookies(): void {
  const keys = [
    "rania_last_page",
    "rania_last_dress_id",
    "rania_preferred_material",
    "rania_session_start",
    "rania_page_view_count",
    "rania_last_action",
    "rania_visited_pages",
  ];
  keys.forEach(deleteCookie);
}
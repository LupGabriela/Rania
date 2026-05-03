import { useEffect } from "react";
import { useLocation } from "react-router";
import { trackPageVisit } from "./cookieService";

export function useActivityTracker(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageVisit(location.pathname);
  }, [location.pathname]);
}
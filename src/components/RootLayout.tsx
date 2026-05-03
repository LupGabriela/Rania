import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { useActivityTracker } from "../data/useActivityTracker";
import { CookieInspector } from "./CookieInspector";

const pageVariants = {
  initial:  { opacity: 0, y: 18 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
  exit:     { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } },
};

export function RootLayout() {
  useActivityTracker();
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ minHeight: "100vh" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <CookieInspector />  
    </>
  );
}
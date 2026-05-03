import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Catalogue } from "./pages/Catalogue";
import { DressDetail } from "./pages/DressDetail";
import { CustomOrder } from "./pages/CustomOrder";
import { VirtualTryOn } from "./pages/VirtualTryOn";
import { AdminForm } from "./pages/AdminForm";
import { MyOrders } from "./pages/MyOrders";
import { DressAnalytics } from "./pages/DressAnalytics";
import { CatalogueDesign } from "./pages/CatalogueDesign";
import { StyleSoul } from "./pages/StyleSoul";
import { DressManager } from "./pages/DressManager";
import { DressManagerDetail } from "./pages/DressManagerDetail";
import { DressManagerForm } from "./pages/DressManagerForm";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      // ── Main pages ──────────────────────────────────────────────
      { path: "/",              Component: Landing },
      { path: "/login",         Component: Login },
      { path: "/register",      Component: Register },
      { path: "/catalogue",     Component: Catalogue },
      { path: "/dress/:id",     Component: DressDetail },
      { path: "/custom-order",  Component: CustomOrder },
      { path: "/try-on",        Component: VirtualTryOn },
      { path: "/admin",         Component: AdminForm },
      { path: "/my-orders",     Component: MyOrders },

      // ── Screens 8–10 ────────────────────────────────────────────
      { path: "/analytics",         Component: DressAnalytics },
      { path: "/catalogue-design",  Component: CatalogueDesign },
      { path: "/style-soul",        Component: StyleSoul },

      // ── Dress Manager ────────────────────────────────────────────
      { path: "/dress-manager",          Component: DressManager },
      { path: "/dress-manager/new",      Component: DressManagerForm },
      { path: "/dress-manager/:id",      Component: DressManagerDetail },
      { path: "/dress-manager/:id/edit", Component: DressManagerForm },
    ],
  },
]);
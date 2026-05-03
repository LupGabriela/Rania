import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import * as store from "../store";
import { dressBodyRules, paginationRules } from "../validation";
import type { PaginatedResponse, DressRecord, StatsResponse, Material, DressSize } from "../types";

const router = Router();

function handleValidationErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

// GET /api/dresses?page=1&limit=10
router.get("/", paginationRules, (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const page = parseInt((req.query.page as string) ?? "1", 10);
  const limit = parseInt((req.query.limit as string) ?? "10", 10);

  const all = store.getAll();
  const total = all.length;
  const totalPages = Math.ceil(total / limit);
  const data = all.slice((page - 1) * limit, page * limit);

  const response: PaginatedResponse<DressRecord> = { data, page, limit, total, totalPages };
  res.json(response);
});

// GET /api/dresses/stats
router.get("/stats", (_req: Request, res: Response) => {
  const all = store.getAll();

  const byMaterial = {} as Record<Material, number>;
  const bySize = {} as Record<DressSize, number>;

  for (const m of store.MATERIALS) byMaterial[m] = 0;
  for (const s of store.SIZES) bySize[s] = 0;

  let totalStock = 0;
  let totalPrice = 0;
  let outOfStock = 0;

  for (const d of all) {
    totalStock += d.stockQuantity;
    totalPrice += d.price;
    if (d.stockQuantity === 0) outOfStock++;
    byMaterial[d.material] = (byMaterial[d.material] ?? 0) + 1;
    for (const s of d.sizes) {
      bySize[s] = (bySize[s] ?? 0) + 1;
    }
  }

  const stats: StatsResponse = {
    totalDresses: all.length,
    totalStock,
    averagePrice: all.length > 0 ? Math.round(totalPrice / all.length) : 0,
    outOfStock,
    byMaterial,
    bySize,
  };

  res.json(stats);
});

// GET /api/dresses/:id
router.get("/:id", (req: Request, res: Response) => {
  const dress = store.getById(req.params.id);
  if (!dress) {
    res.status(404).json({ error: "Dress not found" });
    return;
  }
  res.json(dress);
});

// POST /api/dresses
router.post("/", dressBodyRules, (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const dress = store.create({
    name: req.body.name,
    price: parseFloat(req.body.price),
    material: req.body.material,
    sizes: req.body.sizes,
    stockQuantity: parseInt(req.body.stockQuantity, 10),
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  });

  res.status(201).json(dress);
});

// PUT /api/dresses/:id
router.put("/:id", dressBodyRules, (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const updated = store.update(req.params.id, {
    name: req.body.name,
    price: parseFloat(req.body.price),
    material: req.body.material,
    sizes: req.body.sizes,
    stockQuantity: parseInt(req.body.stockQuantity, 10),
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  });

  if (!updated) {
    res.status(404).json({ error: "Dress not found" });
    return;
  }

  res.json(updated);
});

// DELETE /api/dresses/:id
router.delete("/:id", (req: Request, res: Response) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Dress not found" });
    return;
  }
  res.status(204).send();
});

export default router;

import { Router, Request, Response } from "express";
import { faker } from "@faker-js/faker";
import * as store from "../store";
import { broadcast } from "../websocket";
import type { Material, DressSize } from "../types";

const router = Router();

let generatorInterval: ReturnType<typeof setInterval> | null = null;

const DRESS_IMAGES = [
  "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600",
  "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",
];

function generateFakeDress() {
  const material = faker.helpers.arrayElement<Material>(store.MATERIALS);
  const sizeCount = faker.number.int({ min: 2, max: 4 });
  const sizes = faker.helpers
    .shuffle<DressSize>([...store.SIZES])
    .slice(0, sizeCount)
    .sort((a, b) => store.SIZES.indexOf(a) - store.SIZES.indexOf(b));

  return store.create({
    name: `${faker.commerce.productAdjective()} ${faker.color.human()} Dress`,
    price: faker.number.int({ min: 800, max: 4500 }),
    material,
    sizes,
    stockQuantity: faker.number.int({ min: 0, max: 30 }),
    description: faker.lorem.sentences(2),
    imageUrl: faker.helpers.arrayElement(DRESS_IMAGES),
  });
}

// POST /api/generator/start
router.post("/start", (req: Request, res: Response) => {
  if (generatorInterval) {
    res.status(400).json({ error: "Generator is already running" });
    return;
  }

  const interval = Math.max(1000, parseInt((req.body.interval as string) ?? "3000", 10));

  generatorInterval = setInterval(() => {
    const dress = generateFakeDress();
    broadcast("dress-added", dress);
  }, interval);

  res.json({ message: "Generator started", intervalMs: interval });
});

// POST /api/generator/stop
router.post("/stop", (_req: Request, res: Response) => {
  if (!generatorInterval) {
    res.status(400).json({ error: "Generator is not running" });
    return;
  }

  clearInterval(generatorInterval);
  generatorInterval = null;
  res.json({ message: "Generator stopped" });
});

// GET /api/generator/status
router.get("/status", (_req: Request, res: Response) => {
  res.json({ running: generatorInterval !== null });
});

export { generatorInterval };
export default router;

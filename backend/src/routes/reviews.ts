import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as reviewStore from "../stores/reviews";
import * as dressStore from "../store";

const router = Router({ mergeParams: true });

const reviewBodyRules = [
  body("author").trim().notEmpty().withMessage("author is required")
    .isLength({ min: 2 }).withMessage("author must be at least 2 characters"),
  body("rating").notEmpty().withMessage("rating is required")
    .isInt({ min: 1, max: 5 }).withMessage("rating must be an integer between 1 and 5"),
  body("comment").trim().notEmpty().withMessage("comment is required")
    .isLength({ min: 5 }).withMessage("comment must be at least 5 characters"),
];

function handleValidation(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

// GET /api/dresses/:dressId/reviews
router.get("/", (req: Request, res: Response) => {
  const { dressId } = req.params;
  if (!dressStore.getById(dressId)) {
    res.status(404).json({ error: "Dress not found" });
    return;
  }
  res.json(reviewStore.getByDressId(dressId));
});

// GET /api/dresses/:dressId/reviews/stats
router.get("/stats", (req: Request, res: Response) => {
  const { dressId } = req.params;
  if (!dressStore.getById(dressId)) {
    res.status(404).json({ error: "Dress not found" });
    return;
  }
  res.json(reviewStore.getStats(dressId));
});

// POST /api/dresses/:dressId/reviews
router.post("/", reviewBodyRules, (req: Request, res: Response) => {
  if (handleValidation(req, res)) return;
  const { dressId } = req.params;
  if (!dressStore.getById(dressId)) {
    res.status(404).json({ error: "Dress not found" });
    return;
  }
  const review = reviewStore.create({
    dressId,
    author: req.body.author,
    rating: parseInt(req.body.rating, 10),
    comment: req.body.comment,
  });
  res.status(201).json(review);
});

// PUT /api/reviews/:id
export const updateRouter = Router();
updateRouter.put("/:id", reviewBodyRules, (req: Request, res: Response) => {
  if (handleValidation(req, res)) return;
  const updated = reviewStore.update(req.params.id, {
    author: req.body.author,
    rating: parseInt(req.body.rating, 10),
    comment: req.body.comment,
  });
  if (!updated) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(updated);
});

// DELETE /api/reviews/:id
updateRouter.delete("/:id", (req: Request, res: Response) => {
  const deleted = reviewStore.remove(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.status(204).send();
});

export default router;

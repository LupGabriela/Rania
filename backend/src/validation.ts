import { body, query } from "express-validator";
import { MATERIALS, SIZES } from "./store";

export const dressBodyRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("name is required")
    .isLength({ min: 2 }).withMessage("name must be at least 2 characters"),

  body("price")
    .notEmpty().withMessage("price is required")
    .isFloat({ gt: 0 }).withMessage("price must be a positive number"),

  body("material")
    .notEmpty().withMessage("material is required")
    .isIn(MATERIALS).withMessage(`material must be one of: ${MATERIALS.join(", ")}`),

  body("sizes")
    .isArray({ min: 1 }).withMessage("sizes must be a non-empty array")
    .custom((arr: unknown[]) => {
      const invalid = arr.filter((s) => !SIZES.includes(s as never));
      if (invalid.length > 0) {
        throw new Error(`invalid sizes: ${invalid.join(", ")}. Allowed: ${SIZES.join(", ")}`);
      }
      return true;
    }),

  body("stockQuantity")
    .notEmpty().withMessage("stockQuantity is required")
    .isInt({ min: 0 }).withMessage("stockQuantity must be a non-negative integer"),

  body("description")
    .trim()
    .notEmpty().withMessage("description is required")
    .isLength({ min: 10 }).withMessage("description must be at least 10 characters"),

  body("imageUrl")
    .trim()
    .notEmpty().withMessage("imageUrl is required")
    .isURL().withMessage("imageUrl must be a valid URL"),
];

export const paginationRules = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
];

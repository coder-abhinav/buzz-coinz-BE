import { Router } from "express";
import { getAllProducts, getAllProductsTest } from "../controllers/products.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/testing").get(getAllProductsTest);

export default router;

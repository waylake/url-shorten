import express, { Router } from "express";
import {
  createShortUrl,
  redirectToLongUrl,
  getUrlStats,
  getUserUrls,
} from "../controllers/urlController";
import { authMiddleware } from "../middleware/auth";

const router: Router = express.Router();

router.post("/shorten", authMiddleware, createShortUrl);
router.get("/:shortUrl", redirectToLongUrl);
router.get("/stats/:shortUrl", authMiddleware, getUrlStats);
router.get("/user/urls", authMiddleware, getUserUrls);

export default router;

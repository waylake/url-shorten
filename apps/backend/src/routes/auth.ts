import express, { Router } from "express";
import { register, login, getUserInfo } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getUserInfo);

export default router;

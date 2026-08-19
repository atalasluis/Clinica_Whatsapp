import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authenticate, authController.me);
router.get("/users", authenticate, authController.listUsers);

export default router;

import { Router } from "express";
import { conversationController } from "./conversation.controller";

const router = Router();

router.get("/", conversationController.getAll);
router.get("/:id", conversationController.getById);
router.post("/", conversationController.create);
router.patch("/:id", conversationController.update);
router.patch("/:id/close", conversationController.close);

export default router;
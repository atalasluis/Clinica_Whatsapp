import { Router } from "express";
import * as conversationController from "./conversation.controller";

const router = Router();

router.get("/", conversationController.list);
router.get("/external/:externalId", conversationController.getByExternalId);
router.get("/:id", conversationController.getById);
router.post("/", conversationController.create);
router.patch("/:id", conversationController.update);
router.patch("/:id/close", conversationController.close);

export default router;

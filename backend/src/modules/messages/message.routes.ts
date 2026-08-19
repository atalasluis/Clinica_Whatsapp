import { Router } from "express";
import { messageController } from "./message.controller";

const router = Router();

router.get("/:id", messageController.getById);

router.get(
  "/conversation/:conversationId",
  messageController.getByConversation
);

router.post("/", messageController.create);

export default router;
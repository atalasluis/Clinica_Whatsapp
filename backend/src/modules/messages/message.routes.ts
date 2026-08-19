import { Router } from "express";
import * as messageController from "./message.controller";

const router = Router();

router.get("/conversation/:conversationId", messageController.getByConversation);
router.get("/:id", messageController.getById);
router.post("/", messageController.create);

export default router;

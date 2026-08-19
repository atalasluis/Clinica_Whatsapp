import { Router } from "express";
import { botpressController } from "./botpress.controller";

const router = Router();

router.post(
  "/webhook",
  botpressController.webhook
);

export default router;
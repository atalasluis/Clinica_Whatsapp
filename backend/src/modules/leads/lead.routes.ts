import { Router } from "express";
import { leadController } from "./lead.controller";

const router = Router();

router.get("/", leadController.getAll);
router.get("/:id", leadController.getById);
router.post("/", leadController.create);
router.patch("/:id", leadController.update);

export default router;
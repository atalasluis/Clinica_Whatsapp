import { Router } from "express";
import * as leadController from "./lead.controller";

const router = Router();

router.get("/", leadController.list);
router.get("/:id", leadController.getById);
router.post("/", leadController.create);
router.patch("/:id", leadController.update);

export default router;

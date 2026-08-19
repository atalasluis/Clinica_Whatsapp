import { Router } from "express";
import * as professionalController from "./professional.controller";

const router = Router();

router.get("/", professionalController.list);
router.get("/:id", professionalController.getById);
router.post("/", professionalController.create);
router.patch("/:id", professionalController.update);
router.delete("/:id", professionalController.remove);

export default router;

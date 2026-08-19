import { Router } from "express";
import { professionalController } from "./professional.controller";

const router = Router();

router.get("/", professionalController.getAll);

router.get("/:id", professionalController.getById);

router.post("/", professionalController.create);

router.patch("/:id", professionalController.update);

router.delete("/:id", professionalController.deactivate);

export default router;
import { Router } from "express";
import { specialtyController } from "./specialty.controller";

const router = Router();

router.get("/", specialtyController.getAll);

router.get("/:id", specialtyController.getById);

router.post("/", specialtyController.create);

router.patch("/:id", specialtyController.update);

router.delete("/:id", specialtyController.deactivate);

export default router;
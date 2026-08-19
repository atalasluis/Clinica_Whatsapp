import { Router } from "express";
import { serviceController } from "./service.controller";

const router = Router();

router.get("/", serviceController.getAll);

router.get("/:id", serviceController.getById);

router.post("/", serviceController.create);

router.patch("/:id", serviceController.update);

router.delete("/:id", serviceController.deactivate);

export default router;
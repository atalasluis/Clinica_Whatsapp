import { Router } from "express";
import { clientController } from "./client.controller";

const router = Router();

router.get("/", clientController.getAll);
router.get("/:id", clientController.getById);
router.post("/", clientController.create);
router.patch("/:id", clientController.update);

export default router;
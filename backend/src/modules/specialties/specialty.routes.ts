import { Router } from "express";
import * as specialtyController from "./specialty.controller";

const router = Router();

router.get("/", specialtyController.list);
router.get("/:id", specialtyController.getById);
router.post("/", specialtyController.create);
router.patch("/:id", specialtyController.update);
router.delete("/:id", specialtyController.remove);

export default router;

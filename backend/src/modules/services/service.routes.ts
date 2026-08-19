import { Router } from "express";
import * as serviceController from "./service.controller";

const router = Router();

router.get("/", serviceController.list);
router.get("/:id", serviceController.getById);
router.post("/", serviceController.create);
router.patch("/:id", serviceController.update);
router.delete("/:id", serviceController.remove);

export default router;

import { Router } from "express";
import * as clientController from "./client.controller";

const router = Router();

router.get("/", clientController.list);
router.get("/phone/:phone", clientController.getByPhone);
router.get("/:id", clientController.getById);
router.post("/", clientController.create);
router.patch("/:id", clientController.update);

export default router;

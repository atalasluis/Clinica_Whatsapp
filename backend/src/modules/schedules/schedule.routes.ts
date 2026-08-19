import { Router } from "express";
import * as scheduleController from "./schedule.controller";

const router = Router();

router.get("/", scheduleController.list);
router.get("/:id", scheduleController.getById);
router.get("/professional/:professionalId", scheduleController.getByProfessional);
router.post("/", scheduleController.create);
router.patch("/:id", scheduleController.update);
router.delete("/:id", scheduleController.remove);

export default router;

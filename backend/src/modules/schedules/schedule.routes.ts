import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.get("/", scheduleController.getAll);

router.get(
  "/professional/:professionalId",
  scheduleController.getByProfessional
);

router.get("/:id", scheduleController.getById);

router.post("/", scheduleController.create);

router.patch("/:id", scheduleController.update);

router.delete("/:id", scheduleController.remove);

export default router;
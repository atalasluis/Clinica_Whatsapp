import { Router } from "express";
import * as appointmentController from "./appointment.controller";

const router = Router();

router.get("/", appointmentController.list);
router.get("/:id", appointmentController.getById);
router.post("/", appointmentController.create);
router.patch("/:id", appointmentController.update);
router.patch("/:id/cancel", appointmentController.cancel);

export default router;

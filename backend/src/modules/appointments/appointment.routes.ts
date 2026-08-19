import { Router } from "express";
import { appointmentController } from "./appointment.controller";

const router = Router();

router.get("/", appointmentController.getAll);
router.get("/:id", appointmentController.getById);
router.post("/", appointmentController.create);
router.patch("/:id", appointmentController.update);

router.patch(
  "/:id/cancel",
  appointmentController.cancel
);

export default router;
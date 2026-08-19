import { Router } from "express";
import { analyticsController } from "./analytics.controller";

const router = Router();

router.get(
  "/overview",
  analyticsController.getOverview
);

router.get(
  "/leads",
  analyticsController.getLeadsByStatus
);

router.get(
  "/appointments",
  analyticsController.getAppointmentsByStatus
);

router.get(
  "/specialties",
  analyticsController.getPopularSpecialties
);

export default router;
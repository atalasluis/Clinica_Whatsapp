import { Router } from "express";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.get("/overview", analyticsController.overview);
router.get("/leads-by-status", analyticsController.leadsByStatus);
router.get("/appointments-by-status", analyticsController.appointmentsByStatus);
router.get("/top-specialties", analyticsController.topSpecialties);

export default router;

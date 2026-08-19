import { Router } from "express";
import * as reportController from "./report.controller";

const router = Router();

router.get("/daily", reportController.dailyReport);
router.get("/weekly", reportController.weeklyReport);

export default router;

import { Router } from "express";
import * as alertController from "./alert.controller";

const router = Router();

router.get("/", alertController.getAlerts);
router.get("/count", alertController.alertCount);

export default router;

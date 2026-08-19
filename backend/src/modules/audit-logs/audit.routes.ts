import { Router } from "express";
import * as auditController from "./audit.controller";

const router = Router();

router.get("/", auditController.getRecentActivity);
router.post("/log", auditController.logEntry);

export default router;

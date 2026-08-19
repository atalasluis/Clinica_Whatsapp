import { Router } from "express";
import * as escalationController from "./escalation.controller";

const router = Router();

router.get("/", escalationController.list);
router.post("/escalate", escalationController.escalate);
router.post("/resolve", escalationController.resolve);
router.get("/stats", escalationController.stats);

export default router;

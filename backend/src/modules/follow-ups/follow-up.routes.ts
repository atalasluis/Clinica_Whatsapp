import { Router } from "express";
import * as followUpController from "./follow-up.controller";

const router = Router();

router.get("/", followUpController.getLeadsNeedingFollowUp);
router.post("/mark", followUpController.markFollowedUp);
router.get("/stats", followUpController.stats);

export default router;

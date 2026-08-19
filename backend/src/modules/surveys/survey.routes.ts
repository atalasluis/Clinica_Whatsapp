import { Router } from "express";
import * as surveyController from "./survey.controller";

const router = Router();

router.post("/", surveyController.submitSurvey);
router.get("/stats", surveyController.getSurveyStats);

export default router;

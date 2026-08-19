import { Router } from "express";
import * as speechController from "./speech.controller";

const router = Router();

router.post("/transcribe", speechController.transcribeAudio);

export default router;

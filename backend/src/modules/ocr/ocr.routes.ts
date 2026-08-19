import { Router } from "express";
import * as ocrController from "./ocr.controller";

const router = Router();

router.post("/image", ocrController.processImage);
router.post("/document", ocrController.processDocument);

export default router;

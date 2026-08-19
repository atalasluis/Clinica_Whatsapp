import { Router } from "express";
import * as kbController from "./kb.controller";

const router = Router();

router.get("/", kbController.getFullKnowledgeBase);
router.get("/specialties", kbController.getSpecialties);
router.get("/services", kbController.getServices);
router.get("/professionals", kbController.getProfessionals);
router.get("/faqs", kbController.getFaqs);

export default router;

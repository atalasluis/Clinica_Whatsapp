import { Router } from "express";
import * as duplicateController from "./duplicate.controller";

const router = Router();

router.get("/", duplicateController.findDuplicates);
router.post("/merge", duplicateController.merge);

export default router;

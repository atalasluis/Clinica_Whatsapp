import { Router } from "express";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.get("/overview", analyticsController.overview);
router.get("/leads-by-status", analyticsController.leadsByStatus);
router.get("/appointments-by-status", analyticsController.appointmentsByStatus);
router.get("/top-specialties", analyticsController.topSpecialties);
router.get("/total-messages-received", analyticsController.totalMessagesReceived);
router.get("/messages-auto-attended", analyticsController.messagesAutoAttended);
router.get("/conversations-pending", analyticsController.conversationsPending);
router.get("/avg-response-time", analyticsController.avgResponseTime);
router.get("/messages-per-day", analyticsController.messagesPerDay);
router.get("/leads-by-source", analyticsController.leadsBySource);
router.get("/appointment-conversion-rate", analyticsController.appointmentConversionRate);
router.get("/escalated-conversations", analyticsController.escalatedConversations);
router.get("/performance-by-specialty", analyticsController.performanceBySpecialty);
router.get("/appointments-per-day", analyticsController.appointmentsPerDay);
router.get("/today-summary", analyticsController.todaySummary);

export default router;

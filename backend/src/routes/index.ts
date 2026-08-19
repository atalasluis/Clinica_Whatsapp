import { Router } from "express";

import specialtyRoutes from "../modules/specialties/specialty.routes";
import serviceRoutes from "../modules/services/service.routes";
import professionalRoutes from "../modules/professionals/professional.routes";
import scheduleRoutes from "../modules/schedules/schedule.routes";

import clientRoutes from "../modules/clients/client.routes";
import conversationRoutes from "../modules/conversations/conversation.routes";
import messageRoutes from "../modules/messages/message.routes";
import leadRoutes from "../modules/leads/lead.routes";
import appointmentRoutes from "../modules/appointments/appointment.routes";

import analyticsRoutes from "../modules/analytics/analytics.routes";
import botpressRoutes from "../modules/botpress/botpress.routes";

const router = Router();

router.use("/specialties", specialtyRoutes);
router.use("/services", serviceRoutes);
router.use("/professionals", professionalRoutes);
router.use("/schedules", scheduleRoutes);

router.use("/clients", clientRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/leads", leadRoutes);
router.use("/appointments", appointmentRoutes);

router.use("/analytics", analyticsRoutes);
router.use("/botpress", botpressRoutes);

export default router;
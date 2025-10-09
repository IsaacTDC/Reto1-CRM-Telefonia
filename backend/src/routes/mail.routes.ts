import { Router } from 'express';
import { MailController } from '../controllers/mail.controller';

const router = Router();

// Ruta: POST /api/mail/send-consumption
router.post('/send-consumption', MailController.sendConsumptionEmail);

export default router;
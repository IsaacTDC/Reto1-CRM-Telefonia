import { Request, Response } from 'express';
import { MailService } from '../services/mail.service';

export class MailController {
  
  static async sendConsumptionEmail(req: Request, res: Response) {
    try {
      const { to, subject, pdfBase64, fileName } = req.body;

      if (!to || !subject || !pdfBase64 || !fileName) {
        return res.status(400).json({
          ok: false,
          msg: 'Faltan datos requeridos: to, subject, pdfBase64 o fileName',
        });
      }

      await MailService.sendEmailConsumption(req.body);

      res.status(200).json({
        ok: true,
        msg: 'Correo de consumo enviado correctamente',
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({
        ok: false,
        msg: 'Error al enviar el correo',
        error: (error as Error).message,
      });
    }
  }
}
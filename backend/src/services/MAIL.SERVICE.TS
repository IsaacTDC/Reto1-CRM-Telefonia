import nodemailer from 'nodemailer';

export class MailService{
    private static transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    public static async sendEmailConsumption(dataEmail: {
    to: string;
    subject: string;
    pdfBase64: string;
    fileName: string;}) {
    const { to, subject, pdfBase64, fileName } = dataEmail;

    // Creamos el cuerpo HTML
    const htmlBody = `
      <h2>Informe de Consumos Telefónicos</h2>
      <p>Adjunto encontrarás el informe correspondiente al año seleccionado.</p>
      <p>Gracias por confiar en <strong>CRM Telefonía</strong>.</p>
    `;

    // Enviamos el correo con adjunto
    const info = await this.transporter.sendMail({
      from: `"CRM Telefonía" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: htmlBody,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64.split(';base64,').pop(), // eliminamos prefijo si lo tiene
          encoding: 'base64',
        },
      ],
    });

    console.log('Correo enviado:', info.messageId);
    return info;
  }
}





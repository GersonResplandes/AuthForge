import nodemailer from 'nodemailer';

import { env } from '../env.js';

export async function sendDevelopmentEmail(options: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: false,
  });

  await transporter.sendMail({
    from: env.MAIL_FROM,
    ...options,
  });
}

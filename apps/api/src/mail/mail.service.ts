import { Injectable } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

import { env } from '../env.js';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: false,
    });
  }

  async verifyConnection(): Promise<void> {
    await this.transporter.verify();
  }

  async sendDevelopmentEmail(options: {
    to: string;
    subject: string;
    text: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: env.MAIL_FROM,
      ...options,
    });
  }
}

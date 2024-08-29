import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  // === [CHANGE TO YOUR COMPANY NAME] ===
  company = 'Company';

  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserEmailConfirmation(
    email: string,
    name: string,
    token: string,
    expiresIn: number,
  ) {
    // === [CHANGE TO YOUR API ROUTE] ===
    const confirmEmailUrl = `${this.configService.get<string>('BACKEND_URL')}/v1/auth/confirm-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: `${this.company} - Confirm your email address`,
      template: 'email-confirmation',
      context: {
        name: name,
        confirmationLink: confirmEmailUrl,
        expiresIn: expiresIn,
      },
    });
  }

  async sendUserWelcomeLocal(
    email: string,
    name: string,
    token: string,
    expiresIn: number,
  ) {
    const url = `${this.configService.get<string>('BACKEND_URL')}/v1/auth/confirm-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: `${this.company} - Welcome!`,
      template: 'welcome-local',
      context: {
        name: name,
        confirmationLink: url,
        expiresIn: expiresIn,
      },
    });
  }

  async sendUserWelcomeGoogle(email: string, name: string, password: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `${this.company} - Welcome!`,
      template: 'welcome-google',
      context: {
        name: name,
        temporaryPassword: password,
      },
    });
  }

  async sendUserPasswordReset(
    email: string,
    name: string,
    token: string,
    expiresIn: number,
  ) {
    // === [CHANGE TO YOUR FRONTEND URL] ===
    const url = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: `${this.company} - Password reset`,
      template: 'password-reset',
      context: {
        name: name,
        resetLink: url,
        expiresIn: expiresIn,
      },
    });
  }
}

import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/utilities';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('send_user_email_confirmation')
  async handleUserEmailConfirmation(
    @Payload()
    data: {
      email: string;
      name: string;
      token: string;
      expiresIn: number;
    },
    @Ctx() context: RmqContext,
  ) {
    await this.appService.sendUserEmailConfirmation(
      data.email,
      data.name,
      data.token,
      data.expiresIn,
    );
    this.rmqService.ack(context);
  }

  @EventPattern('send_user_welcome_local')
  async handleUserWelcomeLocal(
    @Payload()
    data: {
      email: string;
      name: string;
      token: string;
      expiresIn: number;
    },
    @Ctx() context: RmqContext,
  ) {
    await this.appService.sendUserWelcomeLocal(
      data.email,
      data.name,
      data.token,
      data.expiresIn,
    );
    this.rmqService.ack(context);
  }

  @EventPattern('send_user_welcome_google')
  async handleUserGeneratedPassword(
    @Payload()
    data: {
      email: string;
      name: string;
      password: string;
    },
    @Ctx() context: RmqContext,
  ) {
    await this.appService.sendUserWelcomeGoogle(
      data.email,
      data.name,
      data.password,
    );
    this.rmqService.ack(context);
  }

  @EventPattern('send_user_password_reset')
  async handleUserPasswordReset(
    @Payload()
    data: {
      email: string;
      name: string;
      token: string;
      expiresIn: number;
    },
    @Ctx() context: RmqContext,
  ) {
    await this.appService.sendUserPasswordReset(
      data.email,
      data.name,
      data.token,
      data.expiresIn,
    );
    this.rmqService.ack(context);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RmqModule } from '@app/utilities';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { join } from 'path';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      // === [IF YOU WANT TO USE MULTIPLE .env FILES] ===
      // envFilePath:
      //   process.env.NODE_ENV === 'production'
      //     ? '.env.production'
      //     : '.env.development',
      isGlobal: true,
      validationSchema: Joi.object({
        FRONTEND_URL: Joi.string().required(),
        BACKEND_URL: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_MAILER_MICROSERVICE_QUEUE: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_PORT: Joi.number().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASS: Joi.string().required(),
        EMAIL_FROM: Joi.string().required(),
      }),
    }),
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          // === [CHANGE TO YOUR COMPANY NAME] ===
          from: `"Company" <${configService.get<string>('EMAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

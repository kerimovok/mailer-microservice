import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqService } from '@app/utilities';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MAILER-MC', {
              colors: true,
              prettyPrint: true,
              processId: true,
            }),
          ),
        }),
        new DailyRotateFile({
          dirname: './logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    }),
  });

  const rmqService = app.get<RmqService>(RmqService);

  const rmqOptions = rmqService.getOptions('MAILER_MICROSERVICE');
  app.connectMicroservice(rmqOptions);

  await app.startAllMicroservices().then(
    () => {
      Logger.log('Mailer microservice is listening');
    },
    (error) => {
      Logger.error(error);
    },
  );
}

bootstrap().catch((error) => {
  Logger.error(error);
});

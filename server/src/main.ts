import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ValidationError } from 'class-validator';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const getErrorMessagesFromValidationErrorObject = (
          error: ValidationError,
        ): string[] => {
          const current = [];
          if (error.constraints)
            current.push(...Object.values(error.constraints));

          for (const children of error.children) {
            current.push(
              ...getErrorMessagesFromValidationErrorObject(children),
            );
          }

          return current;
        };

        const errorMessages = errors.reduce((before, current) => {
          return [
            ...before,
            ...getErrorMessagesFromValidationErrorObject(current),
          ];
        }, []);

        const uniqueErrorMessages = [...new Set(errorMessages)];

        throw new BadRequestException({ message: uniqueErrorMessages });
      },
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 6, // 6 hours
      },
    }),
  );

  app.use(json({ limit: '8mb' }));
  app.use(urlencoded({ extended: true, limit: '8mb' }));
  await app.listen(4000);
}
bootstrap();

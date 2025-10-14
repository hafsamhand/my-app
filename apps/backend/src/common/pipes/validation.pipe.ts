import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

/**
 * Small wrapper using Nest's built-in ValidationPipe configuration.
 */
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({ whitelist: true, forbidNonWhitelisted: true, transform: true });
  }
}

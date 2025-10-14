import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  // Enable CORS so the Next frontend (localhost:3000) can call the backend
  // and send/receive cookies. Configure origin via CORS_ORIGIN or use default.
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({ origin: corsOrigin, credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();

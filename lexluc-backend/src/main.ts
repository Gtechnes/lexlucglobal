import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const PORT = process.env.PORT || 3001;
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: CORS_ORIGIN.split(','),
      credentials: true,
    }),
  );

  // Rate Limiting
  // More lenient for development, stricter limits can be set in production
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: NODE_ENV === 'production' ? 100 : 500, // 500 requests per 15 min in dev, 100 in prod
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
  app.use('/api/', limiter);

  // Global Pipes & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // API Prefix
  app.setGlobalPrefix('api/v1');

  // Listen
  await app.listen(PORT);
  console.log(
    `🚀 Application is running on: http://localhost:${PORT}/api/v1 (${NODE_ENV})`,
  );
}

bootstrap();

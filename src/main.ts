import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PortEnvs, NastEnvs } from './config';
import {
  RpcCustomExceptionFilter,
  BadRequestCustomExceptionFilter,
} from './common';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: NastEnvs.natsServers,
      },
    },
  );

  app.useGlobalFilters(
    new RpcCustomExceptionFilter(),
    new BadRequestCustomExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen();
}
bootstrap();

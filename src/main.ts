import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { App } from './app';
import { Logger } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { MongodbConnection } from './infraestructure/connections/mongodb';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';

const logger = new Logger(bootstrap.name);

async function bootstrap() {
  process.env.TZ = 'UTC';
  const app = await NestFactory.create(App, {
    cors: true,
    snapshot: true,
    forceCloseConnections: true,
    abortOnError: false,
  });

  app.get(MongodbConnection, { strict: false });
  app.enableShutdownHooks();

  const config_service = app.get(ConfigService);
  const AUTH_SERVICE_PORT = Number(config_service.get('AUTH_SERVICE_PORT'));
  const USER_SERVICE_PORT = Number(config_service.get('USER_SERVICE_PORT'));
  const ROLE_SERVICE_PORT = Number(config_service.get('ROLE_SERVICE_PORT'));
  const PERMISSION_SERVICE_PORT = Number(
    config_service.get('PERMISSION_SERVICE_PORT'),
  );

  const credentials = grpc.ServerCredentials.createSsl(
    Buffer.from(process.env.TLS_CA, 'utf8'),
    [
      {
        cert_chain: Buffer.from(process.env.TLS_CERT, 'utf8'),
        private_key: Buffer.from(process.env.TLS_KEY, 'utf8'),
      },
    ],
    true
  );

  const TLS_ENABLE = credentials._isSecure();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: resolve('src/infraestructure/protos/auth.proto'),
      url: `0.0.0.0:${AUTH_SERVICE_PORT}`,
      gracefulShutdown: true,
      credentials,
      loader: {
        keepCase: true,
        defaults: true,
        json: true,
        arrays: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: resolve('src/infraestructure/protos/user.proto'),
      url: `0.0.0.0:${USER_SERVICE_PORT}`,
      gracefulShutdown: true,
      credentials,
      loader: {
        keepCase: true,
        defaults: true,
        json: true,
        arrays: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'role',
      protoPath: resolve('src/infraestructure/protos/role.proto'),
      url: `0.0.0.0:${ROLE_SERVICE_PORT}`,
      gracefulShutdown: true,
      credentials,
      loader: {
        keepCase: true,
        defaults: true,
        json: true,
        arrays: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'permission',
      protoPath: resolve('src/infraestructure/protos/permission.proto'),
      url: `0.0.0.0:${PERMISSION_SERVICE_PORT}`,
      gracefulShutdown: true,
      credentials,
      loader: {
        keepCase: true,
        defaults: true,
        json: true,
        arrays: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.init()

  async function gracefulShutdown(signal: NodeJS.Signals) {
    await app.close();
    process.kill(process.pid, signal);
  }

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
  return {
    AUTH_SERVICE_PORT,
    USER_SERVICE_PORT,
    ROLE_SERVICE_PORT,
    PERMISSION_SERVICE_PORT,
    TLS_ENABLE,
  };
}
bootstrap()
  .then(
    ({
      AUTH_SERVICE_PORT,
      USER_SERVICE_PORT,
      ROLE_SERVICE_PORT,
      PERMISSION_SERVICE_PORT,
      TLS_ENABLE,
    }) => {
      logger.log(`RUNNING ALL GRPC PORTS
      [AUTH] ${AUTH_SERVICE_PORT},
      [USER] ${USER_SERVICE_PORT},
      [ROLE] ${ROLE_SERVICE_PORT},
      [PERMISSION] ${PERMISSION_SERVICE_PORT},
      [TLS] ${TLS_ENABLE ? 'TRUE' : 'FALSE'}
        `);
    },
  )
  .catch((err) => {
    logger.error(err);
    writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
    process.exit(1);
  });

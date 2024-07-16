import { Global, Module } from "@nestjs/common";
import { MongodbConnection } from "./connections/mongodb";
import { PrismaClient } from "@prisma/client";
import { models } from "./config/models";
import { Repository } from "./repositories/repository";
import { JwtManagerService } from "./services/jwt-manager-service";
import { JwtService } from "@nestjs/jwt";
import { GoogleOAuth2Provider } from "./providers/google-oauth2";
import { GoogleRecaptchaProvider } from "./providers/google-recaptcha";
import { NotificationProvider } from "./providers/notification";
import { ClientProvider } from "./providers/client";

@Global()
@Module({
  providers: [
    MongodbConnection,
    PrismaClient,
    ...models.map((entity) => ({
      provide: entity,
      useFactory: (prisma: PrismaClient) => {
        return new Repository(prisma, entity);
      },
      inject: [PrismaClient],
    })),
    JwtService,
    {
      provide: 'JWT',
      useClass: JwtManagerService,
    },
    {
      provide: 'OAUTH',
      useClass: GoogleOAuth2Provider,
    },
    {
      provide: 'RECAPTCHA',
      useClass: GoogleRecaptchaProvider,
    },
    {
      provide: 'NOTIFICATION',
      useClass: NotificationProvider,
    },
    {
      provide: 'CLIENT',
      useClass: ClientProvider,
    },
  ],
  exports: [
    MongodbConnection,
    PrismaClient,
    ...models.map((entity) => ({
      provide: entity,
      useFactory: (prisma: PrismaClient) => {
        return new Repository(prisma, entity);
      },
      inject: [PrismaClient],
    })),
    JwtService,
    {
      provide: 'JWT',
      useClass: JwtManagerService,
    },
    {
      provide: 'OAUTH',
      useClass: GoogleOAuth2Provider,
    },
    {
      provide: 'RECAPTCHA',
      useClass: GoogleRecaptchaProvider,
    },
    {
      provide: 'NOTIFICATION',
      useClass: NotificationProvider,
    },
    {
      provide: 'CLIENT',
      useClass: ClientProvider,
    },
  ],
})
export class Infraestructure {}
import { ClientOptions, Transport } from "@nestjs/microservices";
import { credentials } from '../config/grpc';
import 'dotenv/config';
import { resolve } from "path";
import { SendMassRequest, SendMassResponse, SendSingleRequest, SendSingleResponse } from "@/domain/types/mail";

console.log({
  notification_mail: process.env.GRPC_MAIL_URL,
});
export const mailGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'mail',
    protoPath: resolve('src/infraestructure/protos/mail.proto'),
    url: 'gfrancodev.local:51800',
    gracefulShutdown: true,
    credentials,
    loader: {
      keepCase: true,
      defaults: true,
      json: true,
      arrays: true,
    },
  },
};

export interface MailGrpcClientMethods {
  SendSingle(data: SendSingleRequest): Promise<SendSingleResponse>;
  SendMass(data: SendMassRequest): Promise<SendMassResponse>;
}
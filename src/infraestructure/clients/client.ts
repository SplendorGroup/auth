import { ClientOptions, Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { credentials } from '../config/grpc';
import 'dotenv/config';
import { ClientEntity, CreateClientRequest, DeleteClientRequest, DeleteClientResponse, FindAllClientRequest, FindAllClientResponse, FindOneClientRequest, UpdateClientRequest } from './types/client';
import { Observable } from 'rxjs';

export const clientGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'client',
    protoPath: resolve('src/infraestructure/proto/client.proto'),
    url: process.env.GRPC_CLIENT_URL,
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

export interface ClientGrpcClientMethods {
  CreateClient(data: CreateClientRequest): Observable<ClientEntity>;
  UpdateClient(data: UpdateClientRequest): Observable<ClientEntity>;
  GetClients(data: FindAllClientRequest): Observable<FindAllClientResponse>;
  GetClientById(data: FindOneClientRequest): Observable<ClientEntity>;
  DeleteClient(data: DeleteClientRequest): Observable<DeleteClientResponse>;
}

export type ClientMethodsName = keyof ClientGrpcClientMethods;

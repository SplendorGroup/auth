import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ClientGrpcClientMethods,
  ClientMethodsName,
  clientGrpcClientOptions,
} from '@/infraestructure/clients/client';
import { IClientProvider } from '@/domain/interfaces/iclient';

@Injectable()
export class ClientProvider implements OnModuleInit, IClientProvider {
  @Client(clientGrpcClientOptions)
  private clientClient: ClientGrpc;
  private clientService: ClientGrpcClientMethods;

  onModuleInit() {
    this.clientService = this.clientClient.getService('ClientService');
  }

  async proxyClient(method: ClientMethodsName, data: any): Promise<any> {
    return await lastValueFrom(this.clientService[method](data));
  }
}

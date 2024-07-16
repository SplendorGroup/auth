import { ClientMethodsName } from '@/infraestructure/clients/client';

export interface IClientProvider {
  proxyClient(method: ClientMethodsName, data: any): Promise<any>;
}

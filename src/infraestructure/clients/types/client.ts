export interface AuthUser {
  id: string;
  name: string;
  email: string;
  email_verify: boolean;
  roles: string[];
  permissions: string[];
}

export interface ClientEntity {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientDTO {
  name: string;
  cpf: string;
  cnh: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  body: CreateClientDTO;
  user?: AuthUser;
}

export interface UpdateClientDTO {
  name?: string;
  cpf?: string;
  cnh?: string;
  email?: string;
  phone?: string;
  updated_at?: string;
}

export interface UpdateClientParamDTO {
  id: string;
}

export interface UpdateClientRequest {
  params: UpdateClientParamDTO;
  body: UpdateClientDTO;
  user?: AuthUser;
}

export interface FindOneClientDTO {
  id: string;
}

export interface FindOneClientRequest {
  params: FindOneClientDTO;
  user?: AuthUser;
}

export interface FindAllClientDTO {
  id?: string;
  name?: string;
  cpf?: string;
  page?: number;
}

export interface FindAllClientRequest {
  query?: FindAllClientDTO;
  user?: AuthUser;
}

export interface FindAllClientResponse {
  total: number;
  page: number;
  pages: number;
  per_page: number;
  in_page: number;
  data: ClientEntity[];
}

export interface DeleteClientDTO {
  id: string;
}

export interface DeleteClientRequest {
  params: DeleteClientDTO;
  user?: AuthUser;
}

export interface DeleteClientResponse {}

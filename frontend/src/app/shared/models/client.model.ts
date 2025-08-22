export interface Client {
  id: number;
  code: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  code: string;
  name: string;
}

export interface UpdateClientRequest {
  name: string;
  active: boolean;
}
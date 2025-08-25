export interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  clientType: ClientType;
  region?: string;
  priority: ClientPriority;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  notes?: string;
  clientType: ClientType;
  region?: string;
  priority: ClientPriority;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  address?: string;
  notes?: string;
  clientType?: ClientType;
  region?: string;
  priority?: ClientPriority;
  isActive?: boolean;
}

export enum ClientType {
  ENTERPRISE = 'ENTERPRISE',
  SMB = 'SMB',
  STARTUP = 'STARTUP',
  GOVERNMENT = 'GOVERNMENT',
  PARTNER = 'PARTNER'
}

export enum ClientPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ReleaseClient {
  id: number;
  releaseId: number;
  clientId: number;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  deployedAt?: Date;
  notes?: string;
  client?: Client;
}

export interface CreateReleaseClientRequest {
  releaseId: number;
  clientId: number;
  environment: DeploymentEnvironment;
  notes?: string;
}

export interface UpdateReleaseClientRequest {
  environment?: DeploymentEnvironment;
  status?: DeploymentStatus;
  notes?: string;
  deployedAt?: Date;
}

export enum DeploymentEnvironment {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION'
}

export enum DeploymentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ROLLBACK = 'ROLLBACK'
}

export interface ClientFilter {
  search?: string;
  clientType?: ClientType[];
  priority?: ClientPriority[];
  region?: string[];
  isActive?: boolean;
}

export interface ClientStatistics {
  totalClients: number;
  activeClients: number;
  clientsByType: Record<ClientType, number>;
  clientsByPriority: Record<ClientPriority, number>;
  clientsByRegion: Record<string, number>;
}
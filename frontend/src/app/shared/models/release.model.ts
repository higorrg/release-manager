export interface Release {
  id: number;
  productName: string;
  version: string;
  status: string;
  releaseNotes?: string;
  prerequisites?: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReleasesResult {
  releases: Release[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateReleaseRequest {
  productName: string;
  version: string;
}

export interface UpdateStatusRequest {
  status: string;
  observation?: string;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface ClientEnvironment {
  id: number;
  clientCode: string;
  clientName: string;
  environment: string;
}

export interface AddClientEnvironmentRequest {
  clientCode: string;
  environment: 'homologacao' | 'producao';
}

export interface HistoryEntry {
  id: number;
  previousStatus?: string;
  newStatus: string;
  observation?: string;
  changedBy: string;
  changedAt: string;
}
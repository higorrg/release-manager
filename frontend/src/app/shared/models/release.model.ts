export interface Release {
  id: number;
  product: string;
  version: string;
  releaseNotes: string;
  prerequisites: string;
  status: ReleaseStatus;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  tags?: string[];
  priority: ReleasePriority;
  totalClients?: number;
  deployedClients?: number;
}

export interface CreateReleaseRequest {
  product: string;
  version: string;
  releaseNotes: string;
  prerequisites: string;
  scheduledDate?: Date;
  tags?: string[];
  priority: ReleasePriority;
}

export interface UpdateReleaseRequest {
  product?: string;
  version?: string;
  releaseNotes?: string;
  prerequisites?: string;
  scheduledDate?: Date;
  tags?: string[];
  priority?: ReleasePriority;
}

export interface UpdateReleaseStatusRequest {
  status: ReleaseStatus;
  observation?: string;
}

export enum ReleaseStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  TESTING = 'TESTING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export enum ReleasePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ReleasePackage {
  id: number;
  releaseId: number;
  fileName: string;
  originalName: string;
  size: number;
  uploadedBy: number;
  uploadedAt: Date;
  downloadUrl: string;
  checksum?: string;
}

export interface ReleaseStatistics {
  totalReleases: number;
  releasesByStatus: Record<ReleaseStatus, number>;
  releasesByPriority: Record<ReleasePriority, number>;
  recentReleases: Release[];
  upcomingReleases: Release[];
}

export interface ReleaseFilter {
  status?: ReleaseStatus[];
  priority?: ReleasePriority[];
  product?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  createdBy?: number[];
}
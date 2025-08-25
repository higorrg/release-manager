import { ReleaseStatus } from './release.model';

export interface ReleaseHistory {
  id: number;
  releaseId: number;
  previousStatus?: ReleaseStatus;
  newStatus: ReleaseStatus;
  observation?: string;
  changedBy: number;
  changedAt: Date;
  changedByUser?: {
    id: number;
    username: string;
    name: string;
  };
}

export interface CreateReleaseHistoryRequest {
  releaseId: number;
  previousStatus?: ReleaseStatus;
  newStatus: ReleaseStatus;
  observation?: string;
}

export interface ReleaseHistoryFilter {
  releaseId?: number;
  status?: ReleaseStatus[];
  changedBy?: number[];
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ReleaseTimeline {
  id: number;
  releaseId: number;
  event: TimelineEvent;
  description: string;
  timestamp: Date;
  user?: {
    id: number;
    username: string;
    name: string;
  };
  metadata?: Record<string, any>;
}

export enum TimelineEvent {
  CREATED = 'CREATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  CLIENT_ADDED = 'CLIENT_ADDED',
  CLIENT_REMOVED = 'CLIENT_REMOVED',
  PACKAGE_UPLOADED = 'PACKAGE_UPLOADED',
  PACKAGE_DOWNLOADED = 'PACKAGE_DOWNLOADED',
  NOTE_ADDED = 'NOTE_ADDED',
  SCHEDULED = 'SCHEDULED',
  DEPLOYED = 'DEPLOYED'
}
export interface Release {
  id: string;
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
  MR_APROVADO = 'MR_APROVADO',
  FALHA_BUILD_TESTE = 'FALHA_BUILD_TESTE',
  PARA_TESTE_SISTEMA = 'PARA_TESTE_SISTEMA',
  EM_TESTE_SISTEMA = 'EM_TESTE_SISTEMA',
  REPROVADA_TESTE = 'REPROVADA_TESTE',
  APROVADA_TESTE = 'APROVADA_TESTE',
  FALHA_BUILD_PRODUCAO = 'FALHA_BUILD_PRODUCAO',
  PARA_TESTE_REGRESSIVO = 'PARA_TESTE_REGRESSIVO',
  EM_TESTE_REGRESSIVO = 'EM_TESTE_REGRESSIVO',
  FALHA_INSTALACAO_ESTAVEL = 'FALHA_INSTALACAO_ESTAVEL',
  INTERNO = 'INTERNO',
  REVOGADA = 'REVOGADA',
  REPROVADA_TESTE_REGRESSIVO = 'REPROVADA_TESTE_REGRESSIVO',
  APROVADA_TESTE_REGRESSIVO = 'APROVADA_TESTE_REGRESSIVO',
  CONTROLADA = 'CONTROLADA',
  DISPONIVEL = 'DISPONIVEL'
}

export const ReleaseStatusDisplayNames: Record<ReleaseStatus, string> = {
  [ReleaseStatus.MR_APROVADO]: 'MR Aprovado',
  [ReleaseStatus.FALHA_BUILD_TESTE]: 'Falha no Build para Teste',
  [ReleaseStatus.PARA_TESTE_SISTEMA]: 'Para Teste de Sistema',
  [ReleaseStatus.EM_TESTE_SISTEMA]: 'Em Teste de Sistema',
  [ReleaseStatus.REPROVADA_TESTE]: 'Reprovada no teste',
  [ReleaseStatus.APROVADA_TESTE]: 'Aprovada no teste',
  [ReleaseStatus.FALHA_BUILD_PRODUCAO]: 'Falha no Build para Produção',
  [ReleaseStatus.PARA_TESTE_REGRESSIVO]: 'Para Teste Regressivo',
  [ReleaseStatus.EM_TESTE_REGRESSIVO]: 'Em Teste Regressivo',
  [ReleaseStatus.FALHA_INSTALACAO_ESTAVEL]: 'Falha na instalação da Estável',
  [ReleaseStatus.INTERNO]: 'Interno',
  [ReleaseStatus.REVOGADA]: 'Revogada',
  [ReleaseStatus.REPROVADA_TESTE_REGRESSIVO]: 'Reprovada no teste regressivo',
  [ReleaseStatus.APROVADA_TESTE_REGRESSIVO]: 'Aprovada no teste regressivo',
  [ReleaseStatus.CONTROLADA]: 'Controlada',
  [ReleaseStatus.DISPONIVEL]: 'Disponível'
};

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
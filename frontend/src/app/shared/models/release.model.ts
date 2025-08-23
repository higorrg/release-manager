export interface Release {
  id: number;
  productName: string;
  version: string;
  versionType: VersionType;
  status: ReleaseStatus;
  branchName?: string;
  commitHash?: string;
  releaseNotes?: string;
  prerequisites?: string;
  packageUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  statusHistory: StatusHistory[];
  clientEnvironments: ClientEnvironment[];
}

export interface StatusHistory {
  id: number;
  previousStatus: ReleaseStatus;
  newStatus: ReleaseStatus;
  reason?: string;
  changedBy: string;
  changedAt: string;
}

export interface ClientEnvironment {
  id: number;
  clientCode: string;
  environment: Environment;
  createdAt: string;
}

export enum VersionType {
  KIT = 'KIT',
  SERVICE_PACK = 'SERVICE_PACK', 
  PATCH = 'PATCH'
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

export enum Environment {
  HOMOLOGACAO = 'HOMOLOGACAO',
  PRODUCAO = 'PRODUCAO'
}

export interface CreateReleaseRequest {
  productName: string;
  version: string;
  versionType: VersionType;
  branchName?: string;
  commitHash?: string;
}

export interface UpdateStatusRequest {
  newStatus: ReleaseStatus;
  reason?: string;
}

export interface AddClientRequest {
  clientCode: string;
  environment: Environment;
}

// Status descriptions for UI
export const STATUS_DESCRIPTIONS = {
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

export const VERSION_TYPE_DESCRIPTIONS = {
  [VersionType.KIT]: 'Kit',
  [VersionType.SERVICE_PACK]: 'Service Pack',
  [VersionType.PATCH]: 'Patch'
};

export const ENVIRONMENT_DESCRIPTIONS = {
  [Environment.HOMOLOGACAO]: 'Homologação',
  [Environment.PRODUCAO]: 'Produção'
};
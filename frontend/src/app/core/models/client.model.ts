export interface Client {
    id: string;
    clientCode: string;
    environment: 'homologacao' | 'producao';
    releaseId: string;
    releaseProduct: string;
    releaseVersion: string;
    releaseStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateControlledClientRequest {
    releaseId: string;
    clientCode: string;
    environment: 'homologacao' | 'producao';
}

export interface UpdateControlledClientRequest {
    clientCode?: string;
    environment?: 'homologacao' | 'producao';
}
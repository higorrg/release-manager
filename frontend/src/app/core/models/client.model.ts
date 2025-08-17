export interface Client {
    id: string;
    clientCode: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Environment {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
}

export interface ReleaseClientEnvironment {
    id: string;
    releaseId: string;
    clientId: string;
    environmentId: string;
    createdAt: string;
}

export interface AddControlledClientRequest {
    clientCode: string;
    environment: string;
}
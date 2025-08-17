export interface AvailableVersion {
    releaseId: string;
    productName: string;
    version: string;
    releaseNotes?: string;
    prerequisites?: string;
    downloadUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AvailableVersionsRequest {
    clientCode: string;
    environment: string;
}
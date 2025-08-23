export interface Client {
  id: number;
  clientCode: string;
  companyName: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  isBetaPartner: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  clientCode: string;
  companyName: string;
  contactEmail?: string;
  contactPhone?: string;
  isBetaPartner?: boolean;
  notes?: string;
}

export interface UpdateClientRequest {
  companyName: string;
  contactEmail?: string;
  contactPhone?: string;
  isBetaPartner?: boolean;
  notes?: string;
}
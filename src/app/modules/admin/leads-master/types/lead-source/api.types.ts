import { LeadSource } from "./lead-source.types";


export interface LeadSourceListResponse {
    data: LeadSource[];
}

export interface LeadSourceCreateRequest {
    sourceName: string;
    isActive: boolean;
}

export interface LeadSourceUpdateRequest {
    sourceId: string;
    sourceName: string;
    isActive?: boolean;
}

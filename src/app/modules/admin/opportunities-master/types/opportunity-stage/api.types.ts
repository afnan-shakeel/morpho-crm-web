export interface OpportunityStageCreateRequest {
    name: string;
    probability: number;
    is_closed: boolean;
    sequence: number;
}

export interface OpportunityStageUpdateRequest {
    name: string;
    probability: number;
    is_closed: boolean;
    sequence: number;
}
export interface OpportunityStage {
    stageId: string;
    name: string;
    probability: number;
    is_closed: boolean;
    isSystemDefined: boolean;
    sequence: number;
    createdAt: Date;
} 
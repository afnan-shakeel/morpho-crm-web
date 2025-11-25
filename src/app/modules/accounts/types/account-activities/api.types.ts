import { AccountActivityRelatedToEnum } from "./account-activities.types";

export interface AccountActivityCreateRequest {
    relatedTo: AccountActivityRelatedToEnum;
    relatedEntityId: string;
    accountId: string;
    activityTypeId: string;
    activityHeader: string;
    activityLog: string;
    performedById: string;
}

export interface AccountActivityUpdateRequest {
    activityTypeId?: string;
    activityHeader?: string;
    activityLog?: string;
    performedById?: string;
}
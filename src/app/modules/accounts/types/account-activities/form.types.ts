

export interface AccountActivitiesFormData {
    accountId: string;
    relatedTo: string;
    relatedEntityId: string;
    activityTypeId: string;
    activityHeader: string;
    activityLog: string;
    performedById: string;
    timestamp?: string;
    activityId?: string;
}
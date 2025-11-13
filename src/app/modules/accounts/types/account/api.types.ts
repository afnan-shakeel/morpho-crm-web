import { Account } from './account.types';

export interface createAccountRequest {
  companyName: string;
  industry?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companySize?: string;
  accountStatus?: string;
}

export interface updateAccountRequest extends Partial<createAccountRequest> {
  accountId: string;
}

export interface AccountsListData {
  data: Account[];
  count: number;
  total: number;
  page: number;
  limit: number;
}

export interface CreateAccountActivityPayload {
  relatedTo: string;
  relatedEntityId: string;
  accountId: string;
  activityTypeId: string;
  activityHeader: string;
  activityLog: string;
  eventName?: string;
  eventCategory?: string;
  eventDetailNote?: string;
  performedById: string;
  timestamp: string;
}

export interface UpdateAccountActivityPayload {
  activityId: string;
  relatedTo: string;
  relatedEntityId: string;
  accountId?: string;
  activityTypeId?: string;
  activityHeader?: string;
  activityLog?: string;
  eventName?: string;
  eventCategory?: string;
  eventDetailNote?: string;
  performedById: string;
  timestamp: string;
}

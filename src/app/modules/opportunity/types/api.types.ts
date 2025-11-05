import { ApiResponse } from '../../../core/services/http/types';
import { OpportunityStageFormOption } from './form.types';
import { Opportunity, OpportunityActivity, OpportunityLogs, OpportunityStatus } from './opportunity.types';

/**
 * Create opportunity API payload
 */
export interface CreateOpportunityPayload {
  opportunityName: string;
  accountId: string;
  opportunityOwnerId: number;
  contactId?: string | null;
  stageId: string;
  status: OpportunityStatus;
  closedDate?: string | null;
  expectedCloseDate?: string | null;
  lossReasonCode?: string | null;
  next_step?: string | null;
  notes?: string | null;
}

/**
 * Update opportunity API payload
 */
export interface UpdateOpportunityPayload {
  opportunityName?: string;
  accountId?: string;
  opportunityOwnerId?: number;
  contactId?: string | null;
  stageId?: string;
  status?: OpportunityStatus;
  closedDate?: string | null;
  expectedCloseDate?: string | null;
  lossReasonCode?: string | null;
  next_step?: string | null;
  notes?: string | null;
}

/**
 * Opportunities list data from API
 */
export interface OpportunitiesListData {
  data: Opportunity[];
  count: number;
  total: number;
  page: number;
  limit: number;
}

/**
 * Opportunity lookup data for dropdowns
 */
export interface OpportunityLookupData {
  stages: OpportunityStageFormOption[];
  priorities: Array<{ value: string; label: string }>;
  lossReasons: Array<{ value: string; label: string }>;
}

/**
 * API response types
 */
export interface OpportunityResponse extends ApiResponse<Opportunity> {}
export interface OpportunitiesListResponse extends ApiResponse<OpportunitiesListData> {}
export interface OpportunityLookupDataResponse extends ApiResponse<OpportunityLookupData> {}
export interface OpportunityLogsResponse extends ApiResponse<OpportunityLogs[]> {}
export interface OpportunityActivityResponse extends ApiResponse<OpportunityActivity> {}

/**
 * Create opportunity activity API payload
 */
export interface CreateOpportunityActivityPayload {
  activityType: string;
  activityDate: string;
  subject: string;
  description?: string;
}

/**
 * Update opportunity activity API payload
 */
export interface UpdateOpportunityActivityPayload extends CreateOpportunityActivityPayload {
  activityId: string;
}

/**
 * Stage update payload
 */
export interface UpdateOpportunityStagePayload {
  opportunityId: string;
  stageId: string;
  lossReasonCode?: string | null;
}
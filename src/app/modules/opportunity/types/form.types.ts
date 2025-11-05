import { LossReasonCode, OpportunityActivityType, OpportunityPriority } from './opportunity.types';

/**
 * Form data interface for opportunity form component
 */
export interface OpportunityFormData {
  opportunityId?: string;
  opportunityName: string | null;
  accountId: string | null;
  opportunityOwnerId: string | null;
  contactId?: string | null;
  stageId: string | null;
  amount?: number | null;
  probability?: number | null;
  closedDate?: string | null;
  expectedCloseDate?: string | null;
  lossReasonCode?: string | null;
  next_step?: string | null;
  notes?: string | null;
}

/**
 * Form submission data with additional metadata
 */
export interface OpportunityFormSubmissionData extends OpportunityFormData {
  isEditMode: boolean;
}

/**
 * Opportunity stage option for dropdown
 */
export interface OpportunityStageFormOption {
  value: string;
  label: string;
  probability: number;
}

/**
 * Opportunity priority option for dropdown
 */
export interface OpportunityPriorityOption {
  value: OpportunityPriority;
  label: string;
}

/**
 * Loss reason option for dropdown
 */
export interface LossReasonOption {
  value: LossReasonCode;
  label: string;
}

/**
 * Account option for dropdown/autocomplete
 */
export interface AccountOption {
  accountId: string;
  accountName: string;
}

/**
 * Contact option for dropdown/autocomplete
 */
export interface ContactOption {
  contactId: string;
  contactName: string;
  accountId?: string;
}

/**
 * Opportunity activity form data
 */
export interface OpportunityActivityForm {
  activityId?: string;
  opportunityId: string;
  activityType: OpportunityActivityType;
  activityDate: string;
  subject: string;
  description?: string;
}
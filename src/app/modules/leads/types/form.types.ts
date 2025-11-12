import { LeadSource, LeadStatus } from './lead.types';

/**
 * Form data interface for lead form component
 */
export interface LeadFormData {
  leadId?: string;
  leadOwnerId: string;
  leadOwnerName: string;
  leadSourceId?: string | null;
  leadStatus?: LeadStatus | null;
  leadTopic?: string | null;
  leadConversionDate?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  companyName?: string | null;
}

/**
 * Form submission data with additional metadata
 */
export interface LeadFormSubmissionData extends LeadFormData {
  isEditMode: boolean;
}


/**
 * Lead owner option for dropdown
 */
export interface LeadOwnerOption {
  id: string;
  fullName: string;
  userName?: string;
}

/**
 * Lead source option for dropdown
 */
export interface LeadSourceOption {
  value: LeadSource;
  label: string;
}

/**
 * Lead status option for dropdown
 */
export interface LeadStatusOption {
  value: LeadStatus;
  label: string;
}

export interface LeadAddressForm {
  addressId?: string;
  leadId: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
}


export interface LeadInteractionForm {
  interactionId?: string;
  leadId: string;
  interactionTypeId: string; // Updated to use reference field
  interactionDate: string;
  notes?: string;
}

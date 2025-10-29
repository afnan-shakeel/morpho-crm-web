import { ApiResponse } from '../../../core/services/http/types';
import { LeadStatusOption } from './form.types';
import { Lead, LeadInteraction, LeadInteractionType, LeadStatus } from './lead.types';

/**
 * Create lead API payload
 */
export interface CreateLeadPayload {
  leadOwnerId: number;
  leadOwnerName: string;
  leadSourceId: string | null;
  leadStatus: LeadStatus | null;
  leadConversionDate?: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  companyName: string | null;
}

/**
 * Update lead API payload
 */
export interface UpdateLeadPayload {
  leadId: string;
  leadOwnerId?: number;
  leadOwnerName?: string;
  leadSourceId?: string;
  leadStatus?: LeadStatus;
  leadConversionDate?: string | null;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
}


/**
 * Lead address API payloads
 */
export interface CreateLeadAddressPayload {
  leadId: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isPrimary?: boolean;
}
 

export interface UpdateLeadAddressPayload extends CreateLeadAddressPayload {
  addressId: string;
}

export interface LeadsListData {
  data: Lead[];
  count: number;
  total: number;
  page: number;
  limit: number;
}

export interface LeadLookupData {
  leadStatuses: LeadStatusOption[];
}

export interface LeadLookupDataResponse extends ApiResponse<LeadLookupData> {}

export interface LeadLookupDataResponse extends ApiResponse<LeadLookupData> {}


/**
 * Lead address API response
 */
export interface LeadAddressResponse extends ApiResponse<CreateLeadAddressPayload> {}


export interface CreateLeadInteractionPayload {
  interactionType: LeadInteractionType;
  interactionDate: string;
  notes?: string;
}
export interface UpdateLeadInteractionPayload extends CreateLeadInteractionPayload {
  interactionId: string;
}
export interface LeadInteractionResponse extends ApiResponse<LeadInteraction> {}


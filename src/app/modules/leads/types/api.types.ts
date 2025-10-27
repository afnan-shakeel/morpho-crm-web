import { LeadStatus } from './lead.types';

/**
 * Create lead API payload
 */
export interface CreateLeadPayload {
  leadOwnerId: number;
  leadOwnerName: string;
  leadSource: string | null;
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
  leadSource?: string;
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
  addressType: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}

export interface UpdateLeadAddressPayload extends CreateLeadAddressPayload {
  addressId: string;
}

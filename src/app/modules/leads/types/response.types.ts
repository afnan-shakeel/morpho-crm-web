import { ApiResponse } from '../../../core/services/http/types';
import { LeadSourceOption, LeadStatusOption } from './form.types';
import { Lead } from './lead.types';

/**
 * Leads list data structure
 */
export interface LeadsListData {
  data: Lead[];
  count: number;
  total: number;
  page: number;
  limit: number;
}

/**
 * Lead lookup data API response
 */
export interface LeadLookupDataResponse extends ApiResponse<LeadLookupData> {}

/**
 * Lead lookup data structure
 */
export interface LeadLookupData {
  leadSources: LeadSourceOption[];
  leadStatuses: LeadStatusOption[];
}

/**
 * Lead address API response
 */
export interface LeadAddressResponse extends ApiResponse<LeadAddressData> {}

/**
 * Lead address data structure
 */
export interface LeadAddressData {
  addressId: string;
  leadId: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
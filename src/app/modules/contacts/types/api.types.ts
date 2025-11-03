import { ApiResponse, SearchSort } from '../../../core/services/http/types';
import { Contact } from './contact.types';

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API payload for creating a new contact
 */
export interface CreateContactPayload {
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  contactRole?: string;
  isPrimary: boolean;
  accountId: string;
  contactOwnerId: string;
}

/**
 * API payload for updating an existing contact
 */
export interface UpdateContactPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  contactRole?: string;
  isPrimary?: boolean;
  accountId?: string;
  contactOwnerId?: string;
}

/**
 * API response for contact operations
 */
export interface ContactResponse extends ApiResponse<Contact> { }

/**
 * API response for contact list operations
 */
export interface ContactListResponse extends PaginatedResponse<Contact> { }

/**
 * Contact search parameters
 */
export interface ContactSearchParams extends SearchSort {
  searchTerm?: string;
  accountId?: string;
  contactRole?: string;
  isPrimary?: boolean;
  contactOwnerId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Contact bulk operations payload
 */
export interface BulkContactOperationPayload {
  contactIds: string[];
  operation: 'delete' | 'updateOwner' | 'updateStatus';
  data?: {
    contactOwnerId?: string;
    status?: string;
  };
}

/**
 * Contact bulk operation response
 */
export interface BulkContactOperationResponse extends ApiResponse<{
  success: number;
  failed: number;
  details: Array<{
    contactId: string;
    success: boolean;
    error?: string;
  }>;
}> { }

/**
 * Contact autocomplete response
 */
export interface ContactAutocompleteItem {
  contactId: string;
  fullName: string;
  email: string;
  companyName: string;
  jobTitle?: string;
}

export interface ContactAutocompleteResponse extends ApiResponse<ContactAutocompleteItem[]> { }

/**
 * Contacts list data structure (similar to AccountsListData)
 */
export interface ContactsListData {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
  count: number;
}
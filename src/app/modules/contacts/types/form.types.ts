
/**
 * Contact form data interface (without relations for form usage)
 */
export interface ContactFormData {
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
 * Contact form validation interface
 */
export interface ContactFormValidation {
  fullName: {
    required: boolean;
    minLength?: number;
    maxLength?: number;
  };
  email: {
    required: boolean;
    email: boolean;
  };
  phone?: {
    pattern?: string;
  };
  jobTitle?: {
    maxLength?: number;
  };
  contactRole?: {
    maxLength?: number;
  };
  accountId: {
    required: boolean;
  };
  contactOwnerId: {
    required: boolean;
  };
}

/**
 * Contact filter form interface
 */
export interface ContactFilterForm {
  searchTerm?: string;
  accountId?: string;
  contactRole?: string;
  isPrimary?: boolean;
  contactOwnerId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
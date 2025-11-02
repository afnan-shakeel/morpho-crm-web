/**
 * Base Contact interface representing the core contact entity
 */
export interface Contact {
  contactId: string;
  accountId: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  contactRole?: string;
  isPrimary: boolean;
  contactOwnerId: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  account?: ContactAccount;
  opportunities?: ContactOpportunity[];
}

/**
 * Contact Account relation interface (simplified for display purposes)
 */
export interface ContactAccount {
  accountId: string;
  companyName: string;
  industry?: string;
  companyPhone?: string;
  companyWebsite?: string;
  companySize?: string;
  accountOwnerId: string;
  renewalDate?: string;
  accountStatus: string;
  clientStatus: string;
  productEditionId?: string;
  dateBecameClient?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Contact Opportunity relation interface (simplified for display purposes)
 */
export interface ContactOpportunity {
  opportunityId: string;
  opportunityName: string;
  accountId: string;
  opportunityOwnerId: string;
  contactId: string;
  stageId: string;
  closedDate?: string;
  expectedCloseDate?: string;
  lossReasonCode?: string;
  next_step?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Contact role enumeration
 */
export enum ContactRole {
  DECISION_MAKER = 'Decision Maker',
  INFLUENCER = 'Influencer',
  BUYER = 'Buyer',
  USER = 'User',
  TECHNICAL_CONTACT = 'Technical Contact',
  FINANCIAL_CONTACT = 'Financial Contact',
  OTHER = 'Other'
}

/**
 * Contact status enumeration
 */
export enum ContactStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  UNSUBSCRIBED = 'Unsubscribed',
  BOUNCED = 'Bounced'
}
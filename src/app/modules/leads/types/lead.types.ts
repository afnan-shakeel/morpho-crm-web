/**
 * Base Lead interface representing the core lead entity
 */
export interface Lead {
  leadId: string;
  leadOwnerId: number;
  leadOwnerName: string;
  leadSource: string;
  leadStatus: LeadStatus;
  leadConversionDate?: string | null;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Lead status enumeration
 */
export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  PROPOSAL = 'Proposal',
  NEGOTIATION = 'Negotiation',
  CONVERTED = 'Converted',
  LOST = 'Lost',
  UNQUALIFIED = 'Unqualified'
}

/**
 * Lead source enumeration
 */
export enum LeadSource {
  WEBSITE = 'Website',
  REFERRAL = 'Referral',
  SOCIAL_MEDIA = 'Social Media',
  EMAIL_CAMPAIGN = 'Email Campaign',
  PHONE_CALL = 'Phone Call',
  TRADE_SHOW = 'Trade Show',
  ADVERTISEMENT = 'Advertisement',
  OTHER = 'Other'
}

/**
 * Lead address interface
 */
export interface LeadAddress {
  addressId?: string;
  leadId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

/**
 * Address type enumeration
 */
export enum AddressType {
  PRIMARY = 'Primary',
  BILLING = 'Billing',
  SHIPPING = 'Shipping',
  OTHER = 'Other'
}


export interface LeadLogs {
  logId: string;
  leadId: string;
  logMessage: string;
  changedBy: number;
  changedByName?: string;
  changedAt: string;
  changeType: LeadLogChangeType;
}

export enum LeadLogChangeType {
  ENTITY_CREATED = 'Lead Created',
  STATUS_CHANGE = 'Status Change',
  SOURCE_CHANGE = 'Source Change',
  INFO_UPDATE = 'Information Update',
  ADDRESS_UPDATE = 'Address Update',
  OTHER = 'Other'
}

export interface LeadInteraction {
  interactionId: string;
  leadId: string;
  interactionType: LeadInteractionType;
  interactionDate: string;
  notes?: string;
  createdAt: string;
  createdBy: number;
  createdByName: string;
  updatedAt: string;
  updatedBy: number;
}

export enum LeadInteractionType {
  CALL = 'Call',
  EMAIL = 'Email',
  MEETING = 'Meeting',
  FOLLOW_UP = 'Follow-up',
  OTHER = 'Other'
}
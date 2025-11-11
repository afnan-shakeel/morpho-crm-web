import { User } from "../../user/user.types";

/**
 * Base Lead interface representing the core lead entity
 */
export interface Lead {
  leadId: string;
  leadOwnerId: string;
  leadSourceId: string;
  leadStatus: LeadStatus;
  leadTopic?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  companyName?: string;
  convertedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  leadSource?: LeadSource;
  leadOwner?: User;
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
  changedBy: string;
  changedByName?: string;
  changedAt: string;
  changeType: LeadLogChangeType;
  changeByUser?: User;
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
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  createdByUser?: User;
  lead?: Lead;
}

export enum LeadInteractionType {
  CALL = 'Call',
  EMAIL = 'Email',
  MEETING = 'Meeting',
  FOLLOW_UP = 'Follow-up',
  OTHER = 'Other'
}

export interface LeadSource {
  sourceId: string;
  sourceName: string;
}
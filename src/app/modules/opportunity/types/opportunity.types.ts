import { Account } from "../../accounts/types/account";
import { Contact } from "../../contacts/types";
import { User } from "../../user/user.types";

/**
 * Base Opportunity interface representing the core opportunity entity
 */
export interface Opportunity {
  opportunityId: string;
  opportunityName: string;
  accountId: string;
  opportunityOwnerId: string;
  contactId: string;
  stageId: string;
  status: OpportunityStatus;
  closedDate?: string | null;
  expectedCloseDate?: string | null;
  lossReasonCode?: string | null;
  next_step?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional fields that might be populated from relationships
  amount?: number;
  probability?: number;
  opportunityStage? : OpportunityStage;
  account?: Account;
  contact?: Contact;
  opportunityOwner?: User
}

/**
 * Opportunity stage enumeration
 */
export interface OpportunityStage {
  stageId: string;
  name: string;
  probability: number;
  is_closed: boolean;
  sequence: number;
}

export enum OpportunityStatus {
  Active = 'Active',
  Won = 'Won',
  Lost = 'Lost'
}

/**
 * Opportunity priority enumeration
 */
export enum OpportunityPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

/**
 * Loss reason codes enumeration
 */
export enum LossReasonCode {
  COMPETITOR = 'Competitor',
  PRICE = 'Price',
  NO_BUDGET = 'No Budget',
  NO_DECISION = 'No Decision',
  TIMING = 'Timing',
  OTHER = 'Other'
}


/**
 * Opportunity owner interface for dropdown options
 */
export interface OpportunityOwnerOption {
  id: string;
  fullName: string;
  userName: string;
}

/**
 * Opportunity logs interface
 */
export interface OpportunityLogs {
  logId: string;
  opportunityId: string;
  logMessage: string;
  changedBy: string;
  changedByName?: string;
  changedAt: string;
  changeType: OpportunityLogChangeType;
}

export enum OpportunityLogChangeType {
  ENTITY_CREATED = 'Opportunity Created',
  STAGE_CHANGE = 'Stage Change',
  AMOUNT_CHANGE = 'Amount Change',
  INFO_UPDATE = 'Information Update',
  CLOSE_DATE_CHANGE = 'Close Date Change',
  OTHER = 'Other'
}

/**
 * Opportunity activity interface
 */
export interface OpportunityActivity {
  activityId: string;
  opportunityId: string;
  activityType: OpportunityActivityType;
  activityDate: string;
  subject: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  updatedBy: string;
}

export enum OpportunityActivityType {
  CALL = 'Call',
  EMAIL = 'Email',
  MEETING = 'Meeting',
  TASK = 'Task',
  NOTE = 'Note',
  OTHER = 'Other'
}
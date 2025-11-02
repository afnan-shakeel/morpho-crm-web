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
  closedDate?: string | null;
  expectedCloseDate?: string | null;
  lossReasonCode?: string | null;
  next_step?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional fields that might be populated from relationships
  accountName?: string;
  ownerName?: string;
  contactName?: string;
  stageName?: string;
  amount?: number;
  probability?: number;
}

/**
 * Opportunity stage enumeration
 */
export enum OpportunityStage {
  PROSPECTING = 'Prospecting',
  QUALIFICATION = 'Qualification', 
  NEEDS_ANALYSIS = 'Needs Analysis',
  VALUE_PROPOSITION = 'Value Proposition',
  DECISION_MAKERS = 'Decision Makers',
  PERCEPTION_ANALYSIS = 'Perception Analysis',
  PROPOSAL_QUOTE = 'Proposal/Quote',
  NEGOTIATION_REVIEW = 'Negotiation/Review',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
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
 * Opportunity stage interface for dropdown options
 */
export interface OpportunityStageOption {
  stageId: string;
  stageName: string;
  probability: number;
  sortOrder: number;
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
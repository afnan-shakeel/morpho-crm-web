import { AccountActivityTypeMasterTypes } from "../../../admin/account-master/types/account-activity-types";
import { User } from "../../../user/user.types";

export interface AccountActivity {
  activityId: string;
  relatedTo: AccountActivityRelatedToEnum;
  relatedEntityId: string;

  accountId: string;
  activityTypeID: string;
  activityHeader: string;

  activityLog: string;
  eventName: string;
  eventCategory: string;
  eventDetailNote: string;
  performedById: string;
  performedByName?: string;
  timestamp: string;
  performedBy: User;
  activityType?: AccountActivityTypeMasterTypes.AccountActivityType;
}

export enum AccountActivityRelatedToEnum {
  ACCOUNT = 'Account',
  CONTACT = 'Contact',
  OPPORTUNITY = 'Opportunity',
  LEAD = 'Lead',
}

export enum AccountActivityDefaultTypes {
  EVENT = 'Event',
  NOTE = 'Note',
}

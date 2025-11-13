import { Contact } from '../../../contacts/types';
import { User } from '../../../user/user.types';

export interface Account {
  accountId: string;
  companyName: string;
  industry: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companySize?: string;
  accountStatus?: AccountStatusEnum;
  accountOwnerId?: string;

  createdAt: Date;

  accountAddress?: AccountAddress[];
  primaryContact?: AccountPrimaryContact;
  contacts?: Contact[];
  accountOwner?: User;
}

export enum AccountStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
}

export interface AccountAddress {
  addressId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface AccountPrimaryContact {
  accountId: string;
  contactId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}




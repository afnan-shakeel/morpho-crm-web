
export interface Account {
    accountId: string;
    companyName: string;
    industry: string;
    addressDetails?: AccountAddress;
    primaryContact?: AccountPrimaryContact;
}

export interface AccountAddress {
    accountId: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface AccountPrimaryContact {
    accountId: string;
    contactId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
}

export interface AccountActivityLog {
    accountId: string;
    activityType: string;
    activityLog: string;
    eventName: string;
    eventCategory: string;
    eventDetailNote: string;
    performedById: number;
    performedByName?: string;
    timestamp: string;
}
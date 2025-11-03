import { Contact } from "../../contacts/types";

export interface Account {
    accountId: string;
    companyName: string;
    companyPhone?: string;
    companyWebsite?: string;
    industry: string;
    companyPhone?: string;
    companyWebsite?: string;
    companySize?: string;
    accountStatus?: string;
    addressDetails?: AccountAddress;
    primaryContact?: AccountPrimaryContact;
    contacts?: Contact[];
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
    activityId: string;
    relatedTo: string;
    relatedEntityId: string;

    accountId: string;
    activityType: string;
    activitHeader: string;

    activityLog: string;
    eventName: string;
    eventCategory: string;
    eventDetailNote: string;
    performedById: number;
    performedByName?: string;
    timestamp: string;
    performedBy: {
        UserName: string;
        Name: string;
    }
}
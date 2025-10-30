import { Account } from "./account.types";


export interface createAccountRequest {
  companyName: string;
  industry: string;
}


export interface updateAccountRequest extends Partial<createAccountRequest> {
  accountId: string;
}


export interface AccountsListData {
  data: Account[];
  count: number;
  total: number;
  page: number;
  limit: number;
}


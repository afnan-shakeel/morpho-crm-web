import { Routes } from '@angular/router';
import { AccountMasterListing } from './pages/account-master-listing/account-master-listing';

export const ACCOUNT_MASTER_ROUTES: Routes = [
  {
    path: 'list',
    component: AccountMasterListing,
  },
];

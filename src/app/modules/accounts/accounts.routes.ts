import { Routes } from '@angular/router';
import { AccountsListing } from './pages/accounts-listing/accounts-listing';
import { AccountsMain } from './pages/accounts-main/accounts-main';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: 'list',
    component: AccountsListing,
  },
  {
    path: ':id',
    component: AccountsMain,
  },
];

import { Routes } from '@angular/router';
import { LeadsMasterListing } from './pages/leads-master-listing/leads-master-listing';

export const LEADS_MASTER_ROUTES: Routes = [
  {
    path: 'list',
    component: LeadsMasterListing,
  },
];

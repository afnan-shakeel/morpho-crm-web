import { Routes } from '@angular/router';
import { OpportunityListing } from './pages/opportunity-listing/opportunity-listing';
import { OpportunityMain } from './pages/opportunity-main/opportunity-main';

export const OPPORTUNITY_ROUTES: Routes = [
  {
    path: 'list',
    component: OpportunityListing,
  },
  {
    path: ':id/view',
    component: OpportunityMain,
  },
];
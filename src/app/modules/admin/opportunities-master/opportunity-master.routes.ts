import { Routes } from '@angular/router';
import { OpportunitiesMasterListing } from './pages/opportunities-master-listing/opportunities-master-listing';

export const OPPORTUNITY_MASTER_ROUTES: Routes = [
  {
    path: 'list',
    component: OpportunitiesMasterListing,
  },
];

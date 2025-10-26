import { Routes } from '@angular/router';
import { LeadListing } from './pages/lead-listing/lead-listing';

export const LEADS_ROUTES: Routes = [
  { 
    path: '', 
    component: LeadListing,
  },
  {
    path: 'form',
    loadComponent: () => import('./pages/leads-create-or-update/leads-create-or-update').then(m => m.LeadsCreateOrUpdate)
  }
];
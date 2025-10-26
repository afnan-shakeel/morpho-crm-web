import { Routes } from '@angular/router';
import { LeadListing } from './pages/lead-listing/lead-listing';

export const LEADS_ROUTES: Routes = [
  { 
    path: '', 
    component: LeadListing,
  },
];
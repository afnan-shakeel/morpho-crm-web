import { Routes } from '@angular/router';
import { ContactsListing } from './pages/contacts-listing/contacts-listing';

export const CONTACTS_ROUTES: Routes = [
  {
    path: 'list',
    component: ContactsListing,
  },
];
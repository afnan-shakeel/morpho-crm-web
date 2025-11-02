import { Routes } from '@angular/router';

export const contactsRoutes: Routes = [
  {
    path: '',
    children: [
      // TODO: Uncomment these routes when page components are created
      // {
      //   path: '',
      //   loadComponent: () => import('./pages/contact-listing/contact-listing').then(m => m.ContactListing),
      //   title: 'Contacts - CRM'
      // },
      // {
      //   path: 'create',
      //   loadComponent: () => import('./pages/contact-create/contact-create').then(m => m.ContactCreate),
      //   title: 'Create Contact - CRM'
      // },
      // {
      //   path: 'edit/:id',
      //   loadComponent: () => import('./pages/contact-edit/contact-edit').then(m => m.ContactEdit),
      //   title: 'Edit Contact - CRM'
      // },
      // {
      //   path: 'view/:id',
      //   loadComponent: () => import('./pages/contact-detail/contact-detail').then(m => m.ContactDetail),
      //   title: 'Contact Details - CRM'
      // }
      
      // Temporary redirect until pages are implemented
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
import { Routes } from "@angular/router";
import { AccountsListing } from "./pages/accounts-listing/accounts-listing";
import { AccountsMain } from "./pages/accounts-main/accounts-main";


export const ACCOUNTS_ROUTES: Routes = [
    {
        path: 'list',
        component: AccountsListing,
    },
    {
        path: ':id',
        component: AccountsMain,
        children: [
            // summary page
            {
                path: 'view',
                loadComponent: () => import('./pages/accounts-summary/accounts-summary')
                    .then(m => m.AccountsSummary)
            }
        ],
    },
];
import { Login } from '@/modules/auth/pages/login/login';
import { Routes } from '@angular/router';
import { authGuard } from './core/guards';
import { Main } from './layouts/main/main';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        component: Main,
        children: [
            {
                path: 'dashboard',
                canActivate: [authGuard],
                loadChildren: () =>
                    import('./modules/dashboard/dashboard.routes')
                        .then(m => m.DASHBOARD_ROUTES)
            },
            {
                path: 'leads',
                canActivate: [authGuard],
                loadChildren: () =>
                    import('./modules/leads/leads.routes')
                        .then(m => m.LEADS_ROUTES)
            },
            {
                path: 'accounts',
                canActivate: [authGuard],
                loadChildren: () =>
                    import('./modules/accounts/accounts.routes')
                        .then(m => m.ACCOUNTS_ROUTES)
            }
        ]
    },
    

];

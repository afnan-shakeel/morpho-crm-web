import { Login } from '@/modules/auth/pages/login/login';
import { Routes } from '@angular/router';
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
                loadChildren: () =>
                    import('./modules/dashboard/dashboard.routes')
                        .then(m => m.DASHBOARD_ROUTES)
            },
        ]
    },

];

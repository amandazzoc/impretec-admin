import { Routes } from '@angular/router';
import { Calculator } from './pages/calculator/calculator';
import { NewOrder } from './pages/new-order/new-order';
import { Kanban } from './pages/kanban/kanban';
import { Dashboard } from './pages/dashboard/dashboard';
import { ArchivedOrders } from './pages/archived-orders/archived-orders';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  {
    path: 'kanban',
    children: [
      { path: '', component: Kanban },
      { path: 'arquivados', component: ArchivedOrders },
    ],
  },
  { path: 'novo-pedido', component: NewOrder },
  { path: 'orcamento', component: Calculator },
];

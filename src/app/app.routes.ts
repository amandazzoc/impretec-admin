import { Routes } from '@angular/router';
import { Calculator } from './pages/calculator/calculator';
import { NewOrder } from './pages/new-order/new-order';
import { Kanban } from './pages/kanban/kanban';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'kanban', component: Kanban },
  { path: 'novo-pedido', component: NewOrder },
  { path: 'orcamento', component: Calculator },
];

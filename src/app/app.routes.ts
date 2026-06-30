import { Routes } from '@angular/router';
import { Calculator } from './pages/calculator/calculator';
import { NewOrder } from './pages/new-order/new-order';
import { Kanban } from './pages/kanban/kanban';

export const routes: Routes = [
  { path: '', redirectTo: '/kanban', pathMatch: 'full' },
  { path: 'kanban', component: Kanban },
  { path: 'novo-pedido', component: NewOrder },
  { path: 'orcamento', component: Calculator },
];

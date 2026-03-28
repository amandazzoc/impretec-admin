import { Routes } from '@angular/router';
import { Calculator } from './pages/calculator/calculator';
import { Dashboard } from './pages/dashboard/dashboard';
import { NewOrder } from './pages/new-order/new-order';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'novo-pedido', component: NewOrder },
  { path: 'orcamento', component: Calculator },
];

import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', title: 'Orders', loadComponent: () => import('./orders').then(m => m.OrdersComponent) },
  { path: 'order/:id', title: 'Order time log', loadComponent: () => import('./detail').then(m => m.DetailComponent) },
  { path: '**', redirectTo: '' },
];

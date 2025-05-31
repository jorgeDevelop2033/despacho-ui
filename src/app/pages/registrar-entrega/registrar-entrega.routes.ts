// registrar-entrega.routes.ts
import { Routes } from '@angular/router';

export const REGISTRAR_ENTREGA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./registrar-entrega.component').then(m => m.RegistrarEntregaComponent)
  }
];

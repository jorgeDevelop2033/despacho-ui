// registrar-entrega.routes.ts
import { Routes } from '@angular/router';

export const REGISTRAR_BUSCARDESPACHOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./buscar-despachos.component').then(m => m.DespachosBuscarComponent)
  }
];

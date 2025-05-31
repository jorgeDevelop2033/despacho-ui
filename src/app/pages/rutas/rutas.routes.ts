import { Routes } from '@angular/router';

export const RUTAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./crear-ruta.component').then(m => m.CrearRutaComponent)
  }
];

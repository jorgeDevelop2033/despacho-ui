import { CuadreReporteComponent } from './cuadre-reporte.component';
import { Routes } from '@angular/router';

export const REPORTE_CUADRE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../reportes/cuadre-reporte.component').then(m => m.CuadreReporteComponent)
  }
];
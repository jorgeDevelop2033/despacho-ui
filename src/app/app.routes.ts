import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';
import { AsignarPermisosComponent } from './pages/asignar-roles-permisos/asignar-permisos.component';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'rutas',
        loadChildren: () =>
          import('./pages/rutas/rutas.routes').then(m => m.RUTAS_ROUTES)
      },
      {
        path: 'entregas',
        loadChildren: () =>
          import('./pages/entregas/entregas.routes').then(m => m.ENTREGAS_ROUTES)
      },
      {
        path: 'entregasregistrar',
        loadChildren: () =>
          import('./pages/registrar-entrega/registrar-entrega.routes').then(m => m.REGISTRAR_ENTREGA_ROUTES)
      },
      {
        path: 'reportes/cuadre/:despachoId',
        loadChildren: () =>
          import('./pages/cuadre/reportes/cuadre-reporte.component.routes').then(m => m.REPORTE_CUADRE_ROUTES)
      },
      {
        path: 'buscardespacho',
        loadChildren: () =>
          import('./pages/registrar-devoluciones/buscar-despachos-entrega/buscardespachos.routes').then(m => m.REGISTRAR_BUSCARDESPACHOS_ROUTES)
      },
      {
        path: 'devoluciones/formulario/:id',
        loadComponent: () =>
          import('../../src/app/pages/registrar-devoluciones/completar-devoluciones/devolucion-form.component').then(m => m.DevolucionFormComponent)
      },
      {
        path: 'usuario/registrarusuario',
        loadComponent: () =>
          import('../../src/app/pages/usuarios/usuario.component').then(m => m.RegistroComponent)
      },
      {
        path: 'producto/registrarproducto',
        loadComponent: () =>
          import('../../src/app/pages/producto-form/producto-form.component').then(m => m.ProductoFormComponent)
      },
      {
        path: 'usuario/roles/asignarpermisos',
        loadComponent: () =>
          import('../../src/app/pages/asignar-roles-permisos/asignar-permisos.component').then(m => m.AsignarPermisosComponent)
      },
      {
        path: 'listar/producto',
        loadComponent: () =>
          import('../../src/app/pages/producto-form/producto-list/producto-list.component').then(m => m.ProductoListComponent)
      },
      {
        path: 'calendario',
        loadComponent: () =>
          import('../../src/app/pages/components/seleccionar-semana/seleccionar-semana.component').then(m => m.SelectorFechaComponent)
      },
      {
        path: 'balance/semanal',
        loadComponent: () =>
          import('../../src/app/pages/reportes/balance-semanal/balance-semanal.component').then(m => m.BalanceSemanalComponent)
      },
      {
        path: 'devoluciones/buscar-filtro',
        loadComponent: () =>
          import('../../src/app/pages/registrar-devoluciones/buscar-despachos-entrega-filtros/buscar-despachos-entrega-filtros.component').then(m => m.FiltroBusquedaComponent)
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

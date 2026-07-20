import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lista-trabajadores/lista-trabajadores.component').then(
        (m) => m.ListaTrabajadoresComponent
      )
  },
  {
    path: 'trabajador/nuevo',
    loadComponent: () =>
      import('./pages/formulario-trabajador/formulario-trabajador.component').then(
        (m) => m.FormularioTrabajadorComponent
      )
  },
  {
    path: 'trabajador/:id/editar',
    loadComponent: () =>
      import('./pages/formulario-trabajador/formulario-trabajador.component').then(
        (m) => m.FormularioTrabajadorComponent
      )
  },
  {
    path: 'trabajador/:id',
    loadComponent: () =>
      import('./pages/ficha-trabajador/ficha-trabajador.component').then(
        (m) => m.FichaTrabajadorComponent
      )
  },
  { path: '**', redirectTo: '' }
];

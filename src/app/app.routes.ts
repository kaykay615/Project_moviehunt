import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  
  {
    path: 'index',
    loadComponent: () => import('./index/index.page').then( m => m.IndexPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then(m => m.PerfilPage),
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./movie-details/movie-details.page').then(m => m.MovieDetailsPage),
  },
];

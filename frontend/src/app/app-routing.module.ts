import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
    pathMatch: 'full'
  },
  {
    path: 'tv-live',
    loadChildren: () => import('./features/tv-live/tv-live.module').then(m => m.TvLiveModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'movies',
    loadChildren: () => import('./features/movies/movies.module').then(m => m.MoviesModule)
  },
  {
    path: 'series',
    loadChildren: () => import('./features/series/series.module').then(m => m.SeriesModule)
  },
  {
    path: 'series/:id',
    loadChildren: () => import('./features/series/series.module').then(m => m.SeriesModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./features/favorites/favorites.module').then(m => m.FavoritesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('./features/history/history.module').then(m => m.HistoryModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: '/auth/register', pathMatch: 'full' },
  {
    path: 'player/:id',
    loadChildren: () => import('./features/player/player.module').then(m => m.PlayerModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    enableTracing: false,
    bindToComponentInputs: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

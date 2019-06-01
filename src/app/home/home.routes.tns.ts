import { Routes } from '@angular/router';
// app
import { HomeComponent } from './components/home/home.component';

export const HomeRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'about',
        loadChildren: () => import('./app/+about/about.module').then(m => m.AboutModule)
        // TODO: Uncomment below line when building for webpack
        // loadChildren: '../+about/about.module#AboutModule'
    }
];

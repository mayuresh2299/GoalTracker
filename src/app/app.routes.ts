import { Routes } from '@angular/router';
import {Home} from './component/home/home';
import {About} from './component/about/about';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./component/home/home').then(m => m.Home)
    },
    {
        path: 'about', loadComponent: () => import('./component/about/about').then(m => m.About)
    },
    // {
    //     path: 'allGoals', component: AllGoals
    // },
    // {
    //     path: 'dailyGoals', loadComponent: () => import('./component/goals/daily-goals/daily-goals').then(m => m.DailyGoals)
    // }
];

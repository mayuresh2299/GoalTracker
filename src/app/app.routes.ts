import { Routes } from '@angular/router';
import {Home} from './component/home/home';
import { AllGoals } from './component/goals/all-goals/all-goals';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./component/home/home').then(m => m.Home)
    },
    {
        path: 'allGoals', component: AllGoals
    },
    {
        path: 'dailyGoals', loadComponent: () => import('./component/goals/daily-goals/daily-goals').then(m => m.DailyGoals)
    }
];

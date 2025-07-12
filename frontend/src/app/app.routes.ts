import { Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './authGuards/auth.guard';

export const routes: Routes = [
    {path: 'employee-account', component: EmployeeDashboardComponent, canActivate: [AuthGuard]},
    {path: 'employee-management', component: EmployeeManagementComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: '', component: HomeComponent, pathMatch: 'full'},
    {path: '**', component: HomeComponent}
];

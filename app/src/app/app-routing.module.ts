import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProfileComponent } from './auth/create-profile/create-profile.component';
import { GetStartedComponent } from './auth/get-started/get-started.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'login', 
    component: LoginComponent 
  },
  { path: 'get-started', 
    component: GetStartedComponent, 
  },
  {
    path: 'get-started/register',
    component: RegisterComponent
  },
  {
    path: 'create-profile', 
    component: CreateProfileComponent, 
  },
  { 
    path: 'loadboard', 
    component: DashboardComponent, 
  },
  {
    path: 'home',
    component: HomeComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

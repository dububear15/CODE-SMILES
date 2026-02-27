import { Routes } from '@angular/router';
import { HomeComponent } from './home/home'; 
import { AdminComponent } from './admin/admin'; 
import { BookingComponent } from './booking/booking';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { ContactComponent } from './contact/contact';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
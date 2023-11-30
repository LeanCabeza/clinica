import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { LoginComponent } from './page/login/login.component';
import { MainComponent } from './page/main/main.component';
import { RegisterComponent } from './page/register/register.component';
import { SpinnerComponent } from './page/spinner/spinner.component';
import { InformesComponent } from './page/informes/informes.component';


const routes: Routes = [
  {path:'',component: SpinnerComponent},
  {path:'home',component: MainComponent},
  {path:'register',component: RegisterComponent},
  {path:'login',component: LoginComponent},
  {path:'profile',component: MyProfileComponent},
  {path:'informes',component: InformesComponent},
  {
    path: '',
    loadChildren: () => import('./modules/admin-module/admin-module-routing.module').then(m => m.AdminModuleRoutingModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/paciente-module/paciente-module-routing.module').then(m => m.PacienteModuleRoutingModule),
  },
  {
    path: '',
    loadChildren: () => import('./modules/especialista-module/especialista-module-routing.module').then(m => m.EspecialistaModuleRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

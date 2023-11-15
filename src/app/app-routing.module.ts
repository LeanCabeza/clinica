import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { LoginComponent } from './page/login/login.component';
import { MainComponent } from './page/main/main.component';
import { RegisterComponent } from './page/register/register.component';
import { AdminPanelComponent } from './page/admin-panel/admin-panel.component';
import { PacientePanelComponent } from './page/paciente-panel/paciente-panel.component';
import { SpinnerComponent } from './page/spinner/spinner.component';
import { EspecialistaPanelComponent } from './page/especialista-panel/especialista-panel.component';


const routes: Routes = [
  {path:'',component: SpinnerComponent},
  {path:'home',component: MainComponent},
  {path:'register',component: RegisterComponent},
  {path:'login',component: LoginComponent},
  {path:'profile',component: MyProfileComponent},
  {path:'panelAdmin',component: AdminPanelComponent},
  {path:'panelPaciente',component: PacientePanelComponent},
  {path:'panelEspecialista',component: EspecialistaPanelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

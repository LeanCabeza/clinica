import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from 'src/app/page/admin-panel/admin-panel.component';
import { InformesComponent } from 'src/app/page/informes/informes.component';

const routes: Routes = [
  {path:'panelAdmin',component: AdminPanelComponent},
  {path:'informes',component: InformesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }

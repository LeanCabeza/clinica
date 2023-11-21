import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspecialistaPanelComponent } from 'src/app/page/especialista-panel/especialista-panel.component';

const routes: Routes = [
  {path:'panelEspecialista',component: EspecialistaPanelComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecialistaModuleRoutingModule { }

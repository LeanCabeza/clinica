import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacientePanelComponent } from 'src/app/page/paciente-panel/paciente-panel.component';

const routes: Routes = [
  {path:'panelPaciente',component: PacientePanelComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteModuleRoutingModule { }

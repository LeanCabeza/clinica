import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from 'src/app/page/admin-panel/admin-panel.component';
import { HighchartsChartModule } from 'highcharts-angular';


const routes: Routes = [
  {path:'panelAdmin',component: AdminPanelComponent},
];

@NgModule({
  imports: [
            RouterModule.forChild(routes),
            HighchartsChartModule],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }

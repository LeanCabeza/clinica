import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TurnosService } from 'src/app/service/turnos.service';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  highcharts: any = Highcharts;
  chartOptions: any = {};
  especialidades: string[] = ['Urologo', 'Flevologo', 'Dermatologo', 'Traumatologo', 'Oculista'];
  seriesData: any = [];

  constructor(private turnosService: TurnosService) {}

  ngOnInit() {
    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cantidad de turnos por especialidad'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Cantidad de turnos'
        }
      },
      series: [{
        name: 'Especialidades',
        colorByPoint: true,
        data: this.seriesData
      }]
    };

    this.loadChartData();
  }

  loadChartData() {
    this.especialidades.forEach(especialidad => {
      this.turnosService.getCantidadTurnosPorEspecialidad(especialidad).subscribe(cantidad => {
        this.seriesData.push({
          name: especialidad,
          y: cantidad
        });

        // Actualiza el gráfico con los nuevos datos
        this.chartOptions.series[0].data = this.seriesData;
        Highcharts.chart('chartContainer', this.chartOptions);
      });
    });
  }
}
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TurnosService } from 'src/app/service/turnos.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  highcharts: any = Highcharts;
  chartOptionsEspecialidades: any = {};
  chartOptionsDias: any = {};
  especialidades: string[] = ['Urologo', 'Flevologo', 'Dermatologo', 'Traumatologo', 'Oculista'];
  seriesDataEspecialidades: any = [];
  seriesDataDias: any = [];

  constructor(private turnosService: TurnosService) {}

  ngOnInit() {
    this.chartOptionsEspecialidades = {
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
        name: 'Turnos',
        colorByPoint: true,
        data: this.seriesDataEspecialidades
      }]
    };

    this.chartOptionsDias = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Cantidad de turnos por día'
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
        name: 'Turnos',
        colorByPoint: true,
        data: this.seriesDataDias
      }]
    };

    this.loadChartData();
  }

  loadChartData() {
    // Cargar datos para la cantidad de turnos por especialidad
    this.especialidades.forEach(especialidad => {
      this.turnosService.getCantidadTurnosPorEspecialidad(especialidad).subscribe(cantidad => {
        this.seriesDataEspecialidades.push({
          name: especialidad,
          y: cantidad
        });

        // Actualizar el gráfico con los nuevos datos
        this.chartOptionsEspecialidades.series[0].data = this.seriesDataEspecialidades;
        Highcharts.chart('chartContainerEspecialidades', this.chartOptionsEspecialidades);
      });
    });

    // Cargar datos para la cantidad de turnos por día
    this.turnosService.getDiasConTurnos().subscribe(dias => {
      dias.forEach(dia => {
        this.turnosService.getCantidadTurnosPorDia(dia).subscribe(cantidad => {
          this.seriesDataDias.push({
            name: dia,
            y: cantidad
          });

          // Actualizar el gráfico con los nuevos datos
          this.chartOptionsDias.series[0].data = this.seriesDataDias;
          Highcharts.chart('chartContainerDias', this.chartOptionsDias);
        });
      });
    });
  }
  descargarPdfEspecialidades() {
    const contentEspecialidades = document.getElementById('chartContainerEspecialidades');
  
    if (!contentEspecialidades) {
      console.error('No se pudo encontrar el contenedor del gráfico de especialidades.');
      return;
    }
  
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600],
    });
  
    const logoImg = new Image();
    logoImg.src = "/assets/images/logo.png";
    pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);
  
    pdf.setFontSize(16);
    pdf.text('Obra Social Personal Informatica', 50, 20);
  
    pdf.setFontSize(14);
    pdf.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 10, 70);
  
    html2canvas(contentEspecialidades).then((canvasEspecialidades) => {
      const imgDataEspecialidades = canvasEspecialidades.toDataURL('image/png');
      this.agregarImagenAPdf(pdf, imgDataEspecialidades, 80);
  
      pdf.save('informe_turnos_especialidades.pdf');
    });
  }

  descargarPdfDias() {
    const contentDias = document.getElementById('chartContainerDias');
  
    if (!contentDias) {
      console.error('No se pudo encontrar el contenedor del gráfico de días.');
      return;
    }
  
    const pdf = new jspdf.jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [800, 600],
    });
  
    const logoImg = new Image();
    logoImg.src = "/assets/images/logo.png";
    pdf.addImage(logoImg, 'PNG', 10, 10, 30, 30);
  
    pdf.setFontSize(16);
    pdf.text('Obra Social Personal Informatica', 50, 20);
  
    pdf.setFontSize(14);
    pdf.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 10, 70);
  
    html2canvas(contentDias).then((canvasDias) => {
      const imgDataDias = canvasDias.toDataURL('image/png');
      this.agregarImagenAPdf(pdf, imgDataDias, 80);
  
      pdf.save('informe_turnos_dias.pdf');
    });
  }

  private agregarImagenAPdf(pdf: any, imgData: string, positionY: number) {
    const imgWidth = 800; // Ancho del gráfico
    const imgHeight = 600; // Alto del gráfico
  
    pdf.addImage(imgData, 'PNG', 10, positionY, imgWidth, imgHeight);
  }

}

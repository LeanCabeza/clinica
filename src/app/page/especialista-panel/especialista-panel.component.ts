import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { AuthService } from 'src/app/service/auth.service';
import { TurnosService } from 'src/app/service/turnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especialista-panel',
  templateUrl: './especialista-panel.component.html',
  styleUrls: ['./especialista-panel.component.css']
})
export class EspecialistaPanelComponent implements OnInit {
  
  usuarioLogueado: any;
  turnosPendientesAceptar: Turno[] = [];
  turnosDoctor: Turno[] = [];
  mostrarAceptarRechazar = true;
  mostrarTurnos = false;
  especialidadFiltro: string = '';
  nombreApellidoFiltro: string = '';

  constructor(public authService:AuthService,
              public turnosService: TurnosService            
  ) { }

  ngOnInit() {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
    this.cargarTurnosPendientesAceptar();
    this.cargarTurnos();
  }


  cargarTurnosPendientesAceptar() {
    if (this.usuarioLogueado) {
      this.turnosService.getTurnosPendientesAceptarByEspecialista(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          this.turnosPendientesAceptar = turnos;
        });
    }
  }

  cargarTurnossIMPLE() {
    if (this.usuarioLogueado) {
      this.turnosService.getTurnosAceptadosByEspecialista(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          this.turnosDoctor = turnos;
        });
    }
  }

  cargarTurnos() {
    if (this.usuarioLogueado) {
      this.turnosService.getTurnosAceptadosByEspecialista(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          this.turnosDoctor = turnos.filter(turno => 
            turno.especialidad?.toLowerCase().includes(this.especialidadFiltro.toLowerCase()) 
            &&
            `${turno.nombrePaciente} ${turno.apellidoPaciente}`.toLowerCase().includes(this.nombreApellidoFiltro.toLowerCase())
          );
        });
    }
  }

  verResenia(turno: Turno){
    Swal.fire({
      title: "Reseña del Paciente",
      text: turno.calificacionPaciente,
      width: 600,
      padding: "3em",
      color: "#716add",
      backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `
    });
  }


}

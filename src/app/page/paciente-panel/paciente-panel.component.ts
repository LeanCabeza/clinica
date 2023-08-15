import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { TurnosService } from 'src/app/service/turnos.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';

@Component({
  selector: 'app-paciente-panel',
  templateUrl: './paciente-panel.component.html',
  styleUrls: ['./paciente-panel.component.css']
})
export class PacientePanelComponent implements OnInit {

  especialidades: string[] = ['Pediatria', 'Traumatologia', 'Medico Clinico'];
  doctores: any[] = [];
  fechas:string[] = [];
  horas:string[] = [];
  turnosDisponibles: Turno[] = [];
  especialidadSeleccionada: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
  dniDoctorSeleccionado: any;
  usuarioLogueado: Usuario | null = null;

  constructor(private usuariosService: UsuariosService, private turnosService: TurnosService) {
    this.generarFechas();
    this.cargarHorarios();
   }

  ngOnInit() {
    this.usuariosService.usuarioLogueado$.subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });
  }

  generarFechas() {
    const fechaActual = new Date();

    for (let i = 0; i < 10; i++) {
      const fecha = new Date();
      fecha.setDate(fechaActual.getDate() + i);

      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const anio = fecha.getFullYear();

      const fechaFormateada = `${dia}-${mes}-${anio}`;
      this.fechas.push(fechaFormateada);
    }
  }

  cargarHorarios() {
      this.horas = [];
      const horaInicio = 9;
      const horaFin = 13;
      const intervalo = 30;
  
      for (let hora = horaInicio; hora < horaFin; hora++) {
        for (let minuto = 0; minuto < 60; minuto += intervalo) {
          const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
          this.horas.push(horaFormateada);
        }
      }
      
    console.log(this.horas)
  }

  cargarDoctores() {
    this.usuariosService.getEspecialistaByEspecialidad(this.especialidadSeleccionada)
      .subscribe(doctores => {
        this.doctores = doctores;
        this.dniDoctorSeleccionado = null;
        this.fechaSeleccionada = "";
        this.horaSeleccionada = "";
      });
  }
  
  seleccionarFecha() {
    if (this.dniDoctorSeleccionado && this.fechaSeleccionada) {
      this.cargarHorarios();
    }
  }

  reservarTurno() {
    const turnoOcupado = this.turnosDisponibles.find(turno => turno.hora === this.horaSeleccionada);
    if (turnoOcupado) {
      Swal.fire('Error', 'Este turno ya está reservado.', 'error');
      return;
    }
  
    const nuevoTurno: Turno = {
      especialistaDni: this.dniDoctorSeleccionado,
      pacienteDni: this.usuarioLogueado?.dni.toString(),
      fecha: this.fechaSeleccionada,
      hora: this.horaSeleccionada,
      atendido: false
    };
  
    this.turnosService.guardarTurno(nuevoTurno)
      .then(() => {
        Swal.fire('Operación exitosa!', `Turno guardado con éxito para el ${this.fechaSeleccionada} a las ${this.horaSeleccionada}.`, 'success');
        this.cargarTurnosOcupados();
      })
      .catch(error => {
        Swal.fire('Error', 'Ha ocurrido un error al guardar turno. Por favor, inténtalo de nuevo.', 'error');
      });
  }

  turnoReservado(hora: string): boolean {
    const turnoOcupado = this.turnosDisponibles.find(turno => turno.hora === hora);
    return turnoOcupado !== undefined;
  }

  cargarTurnosOcupados() {
    // Aquí deberías implementar la lógica para obtener los turnos ya reservados
    // y almacenarlos en this.turnosDisponibles.
  }
}
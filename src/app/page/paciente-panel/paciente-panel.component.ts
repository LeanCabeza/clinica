import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { TurnosService } from 'src/app/service/turnos.service';
import { Console } from 'console';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';

@Component({
  selector: 'app-paciente-panel',
  templateUrl: './paciente-panel.component.html',
  styleUrls: ['./paciente-panel.component.css']
})
export class PacientePanelComponent implements OnInit {

  especialidades: string[] = ['Pediatria', 'Traumatologia', 'Medico Clinico'];
  doctores: any[];
  turnosDisponibles: Turno[] = []; // Inicializar como un arreglo vacío
  especialidadSeleccionada: string;
  doctorSeleccionado: any; // Cambiar el tipo a 'any'
  usuarioLogueado: Usuario | null = null;

  constructor(private usuariosService: UsuariosService, private turnosService: TurnosService) { }

  ngOnInit() {
    this.usuariosService.usuarioLogueado$.subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });
  }

  cargarDoctores() {
    console.log("Cargando doctores");
    this.usuariosService.getEspecialistaByEspecialidad(this.especialidadSeleccionada)
      .subscribe(doctores => {
        this.doctores = doctores;
      });
  }

  cargarTurnosOcupados(dniEspecialista: string) {
      console.log(dniEspecialista);
      this.turnosService.getTurnosByEspecialista(dniEspecialista)
        .subscribe(turnosOcupados => {
          this.turnosDisponibles = this.filtrarTurnosDisponibles(turnosOcupados);
        });
  }
  

  filtrarTurnosDisponibles(turnosOcupados: Turno[]): Turno[] {
    console.log("Filtrando turnos disponibles");
    const horariosDisponibles = [];
    for (let hora = 9; hora < 15; hora++) {
      horariosDisponibles.push({ hora: hora, minutos: 0 });
      horariosDisponibles.push({ hora: hora, minutos: 30 });
    }
  
    for (const turnoOcupado of turnosOcupados) {
      const fechaTurno = turnoOcupado.fecha ? new Date(turnoOcupado.fecha) : null;
      if (fechaTurno) {
        const horaTurno = fechaTurno.getHours();
        const minutosTurno = fechaTurno.getMinutes();
        const horarioOcupado = { hora: horaTurno, minutos: minutosTurno };
  
        const index = horariosDisponibles.findIndex(horario =>
          horario.hora === horarioOcupado.hora && horario.minutos === horarioOcupado.minutos
        );
        if (index !== -1) {
          horariosDisponibles.splice(index, 1);
        }
      }
    }
  
    const turnosDisponibles: Turno[] = horariosDisponibles.map(horarioDisponible => {
      const fechaTurnoDisponible = new Date();
      fechaTurnoDisponible.setHours(horarioDisponible.hora);
      fechaTurnoDisponible.setMinutes(horarioDisponible.minutos);
  
      return {
        fecha: fechaTurnoDisponible
      };
    });
  
    return turnosDisponibles;
  }

  cargarTurnos() {
    if (this.doctorSeleccionado) {
      console.log("Doctor seleccionado:", this.doctorSeleccionado);
      this.cargarTurnosOcupados(this.doctorSeleccionado);
    }
  }
  
  reservarTurno(turno: Turno) {

      console.log("El turno:",turno);
      console.log("Dni Doctor seleccionado:", this.doctorSeleccionado);
      console.log("Usuario loggeado -> ", this.usuarioLogueado);
  
      const nuevoTurno: Turno = {
        especialistaDni: this.doctorSeleccionado,
        pacienteDni: this.usuarioLogueado?.dni.toString(), // Agrega el DNI del paciente seleccionado o del usuario actual
        fecha: turno.fecha, // Usa la fecha del turno original
        atendido: false
      };
      this.turnosService.guardarTurno(nuevoTurno)
        .then(() => {
          Swal.fire('Operacion exitosa!', 'Turno guardado con exito', 'success');
        })
        .catch(error => {
          Swal.fire('Error', 'Ha ocurrido un error al guardar turno. Por favor, inténtalo de nuevo.', 'error');
        });
    }
}
  
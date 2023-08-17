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
  arrayHorarios: { horario: string; estado: string }[] = [];
  especialidadSeleccionada: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
  dniDoctorSeleccionado: any;
  usuarioLogueado: Usuario | null = null;  
  showReservarTurno: boolean = false;
  showHistorialClinico: boolean = false;
  showProximosTurnos: boolean = false;
  historialClinico: Turno[] = [];
  proximosTurnos: Turno[] = [];
  especialidadFiltro: string = '';
  nombreApellidoFiltro: string = '';

  constructor(private usuariosService: UsuariosService, private turnosService: TurnosService) {
    this.generarFechas();
   }

  ngOnInit() {
    this.usuariosService.usuarioLogueado$.subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });
  }

  generarFechas() {
    console.log("Generando fechas...");
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
    console.log("Cargando horarios...");

    this.arrayHorarios = [];
    const horaInicio = 9;
    const horaFin = 13;
    const intervalo = 30;
  
    for (let hora = horaInicio; hora < horaFin; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervalo) {
        const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        this.arrayHorarios.push({ 'horario': horaFormateada, 'estado': 'disponible' });
      }
    }
    
    this.turnosService.getTurnosByEspecialista(this.dniDoctorSeleccionado, this.fechaSeleccionada).subscribe(turnos => {
      for (const turno of turnos) {
        const horaOcupada = turno.hora;
        const horaIndex = this.arrayHorarios.findIndex(hora => hora.horario === horaOcupada);
        if (horaIndex !== -1) {
          this.arrayHorarios[horaIndex].estado = 'ocupado';
        }
      }
      });
  }
  

  cargarDoctores() {

    console.log("Cargando Doctores...");
    this.usuariosService.getEspecialistaByEspecialidad(this.especialidadSeleccionada)
      .subscribe(doctores => {
        this.doctores = doctores;
        this.dniDoctorSeleccionado = "";
        this.fechaSeleccionada = "";
        this.horaSeleccionada = "";
      });
  }
  
  seleccionarFecha() {
    if (this.dniDoctorSeleccionado && this.fechaSeleccionada) {
      this.cargarHorarios();
    }
  }

  reservarTurno(hora: string) {

    const doctorSeleccionado = this.doctores.find(doctor => doctor.dni == this.dniDoctorSeleccionado);

    if (doctorSeleccionado) {
      const nuevoTurno: Turno = {
        especialidad: this.especialidadSeleccionada,
        especialistaDni: this.dniDoctorSeleccionado,
        nombreDoctor: doctorSeleccionado.nombre, 
        apellidoDoctor: doctorSeleccionado.apellido,
        pacienteDni: this.usuarioLogueado?.dni.toString(),
        fecha: this.fechaSeleccionada,
        hora: hora,
        atendido: false
      };
    
    Swal.fire({
      title: 'Estas seguro que queres reservar el turno?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.turnosService.guardarTurno(nuevoTurno)
        .then(() => {
          Swal.fire('Operación exitosa!', `Turno guardado con éxito para el ${this.fechaSeleccionada} a las ${nuevoTurno.hora}.`, 'success');
          this.cargarHorarios()
        })
        .catch(error => {
          Swal.fire('Error', 'Ha ocurrido un error al guardar turno. Por favor, inténtalo de nuevo.', 'error');
        });
      } else if (result.isDenied) {
        Swal.fire('Error', 'Ha ocurrido un error al guardar turno. Por favor, inténtalo de nuevo.', 'error');
      }
    })
    }
  }

  cargarHistorialClinico() {
    if (this.usuarioLogueado) {
      this.turnosService.getHistoriaClinica(this.usuarioLogueado.dni.toString())
        .subscribe(historial => {
          this.historialClinico = historial.filter(turno => 
            turno.especialidad?.toLowerCase().includes(this.especialidadFiltro.toLowerCase()) &&
            `${turno.nombreDoctor} ${turno.apellidoDoctor}`.toLowerCase().includes(this.nombreApellidoFiltro.toLowerCase())
          );
        });
    }
  }
  
  cargarProximosTurnos() {
    if (this.usuarioLogueado) {
      this.turnosService.getProximosTurnos(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          this.proximosTurnos = turnos.filter(turno => 
            turno.especialidad?.toLowerCase().includes(this.especialidadFiltro.toLowerCase()) &&
            `${turno.nombreDoctor} ${turno.apellidoDoctor}`.toLowerCase().includes(this.nombreApellidoFiltro.toLowerCase())
          );
        });
    }
  }

  verDetalle(turno: Turno) {
    // Aquí puedes implementar la lógica para mostrar el detalle del turno seleccionado,
    // por ejemplo, usando un modal o una nueva página.
    // Puedes acceder a las propiedades del turno (especialidad, especialistaDni, fecha, hora, etc.)
    // para mostrar la información necesaria.
  }

  

}
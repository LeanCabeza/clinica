import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { TurnosService } from 'src/app/service/turnos.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-paciente-panel',
  templateUrl: './paciente-panel.component.html',
  styleUrls: ['./paciente-panel.component.css']
})
export class PacientePanelComponent implements OnInit {

  especialidades: string[] = ['Urologo', 'Flevologo', 'Dematologo','Traumatologo','Oculista'];
  doctores: any[] = [];
  fechas:string[] = [];
  arrayHorarios: { horario: string; estado: string }[] = [];
  especialidadSeleccionada: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
  dniDoctorSeleccionado: string;
  usuarioLogueado: Usuario | null = null;  
  showReservarTurno: boolean = false;
  showHistorialClinico: boolean = false;
  showProximosTurnos: boolean = false;
  historialClinico: Turno[] = [];
  proximosTurnos: Turno[] = [];
  especialidadFiltro: string = '';
  nombreApellidoFiltro: string = '';

  constructor(private usuariosService: UsuariosService, private turnosService: TurnosService, private authService: AuthService) {
   }

  ngOnInit() {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
  }

  generarFechas(dniDoctor: string) {
    const doctorSeleccionado = this.doctores.find((doctor) => doctor.dni == dniDoctor);
  
    if (!doctorSeleccionado) {
      console.log("Doctor no encontrado, dni:", dniDoctor);
      return;
    }
  
    const diasAtencion = doctorSeleccionado.diasAtencion;
    console.log("Generando fechas del doctor -> ", doctorSeleccionado.diasAtencion);
  
    const fechaActual = new Date();
    const fecha = new Date(); // Crear una única instancia de fecha antes del bucle
  
    const fechasGeneradas:any = []; // Nuevo array para almacenar fechas únicas
  
    for (let i = 0; i < 15; i++) {
      fecha.setDate(fechaActual.getDate() + i);
  
      // Verifica si el día de la semana coincide con uno de los días de atención y no es domingo.
      const diaSemana = fecha.getDay(); // 0 para Domingo, 1 para Lunes, 2 para Martes, etc.
  
      if (diasAtencion.includes(this.getNombreDia(diaSemana)) && diaSemana !== 0) {
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const anio = fecha.getFullYear();
  
        const fechaFormateada = `${dia}-${mes}-${anio}`;
        
        // Verificar si la fecha ya existe en el array antes de agregarla
        if (!fechasGeneradas.includes(fechaFormateada)) {
          fechasGeneradas.push(fechaFormateada);
        }
      }
    }
  
    console.log("ARRAY DE FECHAS GENERADO", fechasGeneradas);
    this.fechas = fechasGeneradas; // Actualizar this.fechas con las fechas únicas
  }
  
  
  // Función para obtener el nombre del día a partir del número (0 para Domingo, 1 para Lunes, etc.).
  getNombreDia(numeroDia:any) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[numeroDia];
  }

  cargarHorarios(dniDoctorSeleccionado?: string, fechaSeleccionada?: string) {
    if (dniDoctorSeleccionado != null && fechaSeleccionada != null) {
      // Obtener el doctor seleccionado
      const doctorSeleccionado = this.doctores.find((doctor) => doctor.dni == dniDoctorSeleccionado);
      console.log("Generando horarios para el doctor ->",doctorSeleccionado.horariosAtencion);
      if (doctorSeleccionado) {
        const disponibilidad = doctorSeleccionado.horariosAtencion;
  
        if (disponibilidad && disponibilidad.length > 0) {
          // Limpiar el array de horarios
          this.arrayHorarios = [];
          // Generar una lista de todos los horarios disponibles en intervalos de 30 minutos
          const horariosDisponibles: string[] = [];
          disponibilidad.forEach((horarioDisponible: string) => {
            const [horaInicio, horaFin] = horarioDisponible.split(" a ");
            const [horaInicioStr, minutoInicioStr] = horaInicio.split(":");
            const [horaFinStr, minutoFinStr] = horaFin.split(":");
            const horaInicioNum = parseInt(horaInicioStr);
            const minutoInicioNum = parseInt(minutoInicioStr);
            const horaFinNum = parseInt(horaFinStr);
            const minutoFinNum = parseInt(minutoFinStr);
  
            for (let hora = horaInicioNum; hora < horaFinNum; hora++) {
              for (let minuto = minutoInicioNum; minuto < 60; minuto += 30) {
                const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
                horariosDisponibles.push(horaFormateada);
              }
            }
          });
  
          // Ordenar los horarios en orden ascendente
          horariosDisponibles.sort();
  
          // Llenar this.arrayHorarios con los horarios ordenados y marcarlos como 'disponible'
          for (const horaFormateada of horariosDisponibles) {
            this.arrayHorarios.push({ horario: horaFormateada, estado: 'disponible' });
          }
  
          // Consultar los turnos ocupados para marcarlos como 'ocupados'
          this.turnosService.getTurnosByEspecialista(dniDoctorSeleccionado, fechaSeleccionada).subscribe(turnos => {
            for (const turno of turnos) {
              const horaOcupada = turno.hora;
              const horaIndex = this.arrayHorarios.findIndex(hora => hora.horario === horaOcupada);
              if (horaIndex !== -1) {
                this.arrayHorarios[horaIndex].estado = 'ocupado';
              }
            }
          });
        } else {
          console.log("El doctor seleccionado no tiene disponibilidad.");
        }
      } else {
        console.log("No se encontró el doctor seleccionado.");
      }
    } else {
      console.log("Primera carga de horarios");
    }
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
      this.cargarHorarios(this.dniDoctorSeleccionado,this.fechaSeleccionada);
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
          this.cargarHorarios(nuevoTurno.especialistaDni,nuevoTurno.fecha);
        })
        .catch(error => {
          Swal.fire('Error', 'Ha ocurrido un error al guardar turno. Por favor, inténtalo de nuevo.', 'error');
        });
      } else if (result.isDenied) {
        Swal.fire('Operacion Cancelada', 'Se cancelo la operacion con exito.', 'warning');
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

  }

  async cancelarTurno(turno: Turno) {
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas cancelar el turno?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      denyButtonText: 'No'
    });
  
    if (result.isConfirmed) {
      try {
        await this.turnosService.cancelarTurno(turno);
        Swal.fire('¡Operación exitosa!', 'Turno cancelado con éxito.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Ha ocurrido un error al cancelar el turno. Por favor, inténtalo de nuevo.', 'error');
      }
    } else if (result.isDenied) {
      Swal.fire('Operación Cancelada', 'No se ha cancelado el turno.', 'info');
    }
  }

  async calificarAtencion(turno: Turno) {
    const result = await Swal.fire({
      title: 'Calificar Atención',
      html: `
        <p>Por favor, califica la atención:</p>
        <select id="calificacion" class="swal2-input">
          <option value="Espectacular">Espectacular</option>
          <option value="Bien">Bien</option>
          <option value="Conforme">Conforme</option>
          <option value="Regular">Regular</option>
          <option value="Mal">Mal</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Calificar',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      const calificacion = (document.getElementById('calificacion') as HTMLSelectElement).value;
      
      try {
        await this.turnosService.calificarTurno(turno, calificacion);
        Swal.fire('¡Calificación exitosa!', 'Gracias por calificar la atención.', 'success');
      } catch (error) {
        console.log(error);
        Swal.fire('Error', 'Ha ocurrido un error al calificar la atención. Por favor, inténtalo de nuevo.', 'error');
      }
    } else if (result.isDismissed) {
      Swal.fire('Operación Cancelada', 'No se ha calificado la atención.', 'info');
    }
  }

  

}
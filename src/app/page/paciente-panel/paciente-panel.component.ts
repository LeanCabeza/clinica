import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { TurnosService } from 'src/app/service/turnos.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';
import { AuthService } from 'src/app/service/auth.service';

interface Especialidad {
  nombre: string;
  imagen: string;
}

@Component({
  selector: 'app-paciente-panel',
  templateUrl: './paciente-panel.component.html',
  styleUrls: ['./paciente-panel.component.css']
})
export class PacientePanelComponent implements OnInit {

  especialidades: Especialidad[] = [
    { nombre: 'Urologo', imagen: '/assets/images/urologo.png' },
    { nombre: 'Flevologo', imagen: '/assets/images/flevologo.png' },
    { nombre: 'Dermatologo', imagen: '/assets/images/dermatologo.png' },
    { nombre: 'Traumatologo', imagen: '/assets/images/traumatologo.png' },
    { nombre: 'Oculista', imagen: '/assets/images/oculista.pngERROR' },
  ];
  doctores: any[] = [];
  fechas:string[] = [];
  arrayHorarios: { horario: string; estado: string }[] = [];
  especialidadSeleccionada: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
  dniDoctorSeleccionado: string;
  usuarioLogueado: Usuario | null = null;  
  showReservarTurno: boolean = true;
  showHistorialClinico: boolean = false;
  showProximosTurnos: boolean = false;
  historialClinico: Turno[] = [];
  proximosTurnos: Turno[] = [];
  especialidadFiltro: string = '';
  nombreApellidoFiltro: string = '';
  filtroFull: string = '';
  pacientes: any;
  pacienteSeleccionado: any;

  constructor(private usuariosService: UsuariosService, private turnosService: TurnosService, private authService: AuthService) {
   }

  ngOnInit() {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
    this.cargarPacientes();
  }

  generarFechas(dniDoctor: string) {
    this.fechaSeleccionada = "";
    this.horaSeleccionada = "";
    
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
          this.turnosService.getTurnosByEspecialista(dniDoctorSeleccionado.toString(), fechaSeleccionada).subscribe(turnos => {
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

  cargarPacientes() {

    console.log("Cargando Pacientes...");
    this.usuariosService.getPacientes()
      .subscribe(pacientes => {
        this.pacientes = pacientes;
        this.pacienteSeleccionado = "",
        this.dniDoctorSeleccionado = "";
        this.fechaSeleccionada = "";
        this.horaSeleccionada = "";
      });
  }
  

  reservarTurno(hora: string) {
    
    const doctorSeleccionado = this.doctores.find(doctor => doctor.dni == this.dniDoctorSeleccionado);
    
    if (doctorSeleccionado) {
      const nuevoTurno: Turno = {
        especialidad: this.especialidadSeleccionada,
        especialistaDni: this.dniDoctorSeleccionado.toString(),
        nombreDoctor: doctorSeleccionado.nombre, 
        apellidoDoctor: doctorSeleccionado.apellido,
        pacienteDni: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.dni.toString() : this.usuarioLogueado?.dni.toString(),
        fecha: this.fechaSeleccionada,
        hora: hora,
        atendido: false,
        confirmacionDoctor: "Pendiente Confirmacion",
        nombrePaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.nombre : this.usuarioLogueado?.nombre,
        apellidoPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.apellido : this.usuarioLogueado?.apellido,
        edadPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.edad : this.usuarioLogueado?.edad,
        obraSocialPaciente: this.usuarioLogueado?.tipoUsuario === "Admin" ? this.pacienteSeleccionado.obraSocial : this.usuarioLogueado?.obraSocial
      };
      console.log("Turnito a reservar:",nuevoTurno);
      
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
    if (this.usuarioLogueado?.tipoUsuario == "Paciente") {
      this.turnosService.getHistoriaClinica(this.usuarioLogueado.dni.toString())
        .subscribe(historial => {
          this.historialClinico = historial.filter(turno => 
            this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
          );
        });
    }else if (this.usuarioLogueado?.tipoUsuario == "Admin"){
      this.turnosService.getHistoriaFull()
      .subscribe(historial => {
        this.historialClinico = historial.filter(turno => 
          this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
        );
      });
    }
  }
  
  cargarProximosTurnos() {
    if (this.usuarioLogueado?.tipoUsuario == "Paciente") {
      this.turnosService.getProximosTurnos(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          this.proximosTurnos = turnos.filter(turno => 
            this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
          );
        });
      }else if (this.usuarioLogueado?.tipoUsuario == "Admin"){
        this.turnosService.getProximosTurnosFull()
        .subscribe(turnos => {
          this.proximosTurnos = turnos.filter(turno => 
            this.concatenatedFields(turno).toLowerCase().includes(this.filtroFull.toLowerCase())
          );
        });
      }
  }
  
  concatenatedFields(turno: any): string {
    // Función auxiliar para asignar un valor predeterminado si es undefined o null
    const defaultValue = (value: any, defaultVal: any = '') => value !== undefined && value !== null ? value : defaultVal;
  
    // Aplicar la lógica para todos los campos
    const apellidoDoctor = defaultValue(turno.apellidoDoctor);
    const apellidoPaciente = defaultValue(turno.apellidoPaciente);
    const altura = defaultValue(turno.atencionDoc?.altura);
    const peso = defaultValue(turno.atencionDoc?.peso);
    const presion = defaultValue(turno.atencionDoc?.presion);
    const temperatura = defaultValue(turno.atencionDoc?.temperatura);
    const key1 =  defaultValue(turno.atencionDoc?.datosDinamicos[0].clave);
    const value1 =  defaultValue(turno.atencionDoc?.datosDinamicos[0].valor);
    const key2 =  defaultValue(turno.atencionDoc?.datosDinamicos[1].clave);
    const value2 =  defaultValue(turno.atencionDoc?.datosDinamicos[1].valor);
    const key3 =  defaultValue(turno.atencionDoc?.datosDinamicos[2].clave);
    const value3 =  defaultValue(turno.atencionDoc?.datosDinamicos[2].valor);
    const confirmacionDoctor = defaultValue(turno.confirmacionDoctor);
    const especialidad = defaultValue(turno.especialidad);
    const fecha = defaultValue(turno.fecha);
    const hora = defaultValue(turno.hora);
    const nombreDoctor = defaultValue(turno.nombreDoctor);
    const nombrePaciente = defaultValue(turno.nombrePaciente);
    const obraSocialPaciente = defaultValue(turno.obraSocialPaciente);
    //console.log(`DATOS TURNOS",${nombreDoctor} ${apellidoDoctor} ${nombrePaciente} ${apellidoPaciente} ${altura} ${peso} ${presion} ${temperatura} ${confirmacionDoctor} ${especialidad} ${fecha} ${hora} ${nombrePaciente} ${obraSocialPaciente} ${key1} ${value1} ${key2} ${value2} ${key3} ${value3}`);
    return `${nombreDoctor} ${apellidoDoctor} ${nombrePaciente} ${apellidoPaciente} ${altura} ${peso} ${presion} ${temperatura} ${confirmacionDoctor} ${especialidad} ${fecha} ${hora} ${nombrePaciente} ${obraSocialPaciente} ${key1} ${value1} ${key2} ${value2} ${key3} ${value3}`;
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

  verDetalle(turno: any) {
    const { altura, datosDinamicos, peso, presion, temperatura } = turno.atencionDoc;
  
    let mensaje = `
      <p><strong>Altura:</strong> ${altura}</p>
      <p><strong>Peso:</strong> ${peso}</p>
      <p><strong>Presión:</strong> ${presion}</p>
      <p><strong>Temperatura:</strong> ${temperatura}</p>
    `;
  
    if (datosDinamicos && datosDinamicos.length > 0) {
      mensaje += '<p> <strong>Datos Dinámicos:</strong></p><ul>';
      datosDinamicos.forEach((dato: any) => {
        mensaje += `<li>${dato.clave}: ${dato.valor}</li>`;
      });
      mensaje += '</ul>';
    }
  
    Swal.fire({
      title: "Reseña brindada por el doctor",
      html: mensaje,
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
    let calificacion = "";
    let comentario = "";
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
        <input id="comentario" class="swal2-input" placeholder="Deja tu comentario..." />
      `,
      showCancelButton: true,
      confirmButtonText: 'Calificar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        calificacion = (document.getElementById('calificacion') as HTMLSelectElement).value;
        comentario = (document.getElementById('comentario') as HTMLInputElement).value;
  
        // Validaciones
        if (!calificacion || !comentario) {
          Swal.showValidationMessage('Por favor, completa tanto la calificación como el comentario.');
        }
        return { calificacion, comentario };
      }
    });
  
    if (result.isConfirmed) {
  
      try {
        const calificacionConComentario = "⭐ Calificacion: " + calificacion + "💭 Comentario: " +  comentario;
  
        await this.turnosService.calificarTurno(turno, calificacionConComentario);
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
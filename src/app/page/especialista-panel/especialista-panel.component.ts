import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { AuthService } from 'src/app/service/auth.service';
import { TurnosService } from 'src/app/service/turnos.service';
import Swal from 'sweetalert2';
import { animations } from 'src/app/animations/animations';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { Usuario } from 'src/app/models/usuario.interface';


@Component({
  selector: 'app-especialista-panel',
  templateUrl: './especialista-panel.component.html',
  styleUrls: ['./especialista-panel.component.css'],
  animations: [animations.slideInTopAnimation]
})
export class EspecialistaPanelComponent implements OnInit {
  
  usuarioLogueado: any;
  turnosPendientesAceptar: Turno[] = [];
  turnosDoctor: Turno[] = [];
  mostrarAceptarRechazar = true;
  mostrarTurnos = false;
  mostrarPacientes = false;
  especialidadFiltro: string = '';
  nombreApellidoFiltro: string = '';
  filtroFull: string = '';
  showSpinner = false;
  pacientes: Usuario[];

  constructor(public authService:AuthService,
              public turnosService: TurnosService,
              public usuariosService:UsuariosService            
  ) { }

  ngOnInit() {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
    this.cargarTurnosPendientesAceptar();
    this.cargarTurnos();
    this.getPacientes();
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
    return `${nombreDoctor} ${apellidoDoctor} ${nombrePaciente} ${apellidoPaciente} ${altura} ${peso} ${presion} ${temperatura} ${confirmacionDoctor} ${especialidad} ${fecha} ${hora} ${nombrePaciente} ${obraSocialPaciente} ${key1} ${value1} ${key2} ${value2} ${key3} ${value3}`;
  }

  finalizarTurno(turno: Turno) {
    Swal.fire({
      title: 'Ingrese datos de la atención',
      html:
        '<form id="atencionForm">' +
        '<div style="display: flex; justify-content: space-between; width: 800px;">' +
        '<div style="flex: 1; margin-right: 10px;">' +
        '<input type="number" id="altura" class="swal2-input" placeholder="📏Altura" required><br>' +
        '<input type="number" id="peso" class="swal2-input" placeholder="⚖ Peso" required><br>' +
        '<input type="number" id="temperatura" class="swal2-input" placeholder="🌡 Temperatura" required><br>' +
        '<input type="number" id="presion" class="swal2-input" placeholder="🅿 Presión" required><br>' +
        '</div>' +
        '<div style="flex: 1; margin-left: 10px;">' +
        '<label for="clave1">Clave 1:</label>' +
        '<input type="text" id="clave1" class="swal2-input" placeholder="🔑Clave"><br>' +
        '<label for="valor1">Valor 1:</label>' +
        '<input type="text" id="valor1" class="swal2-input" placeholder="🧾Valor"><br>' +
        '<label for="clave2">Clave 2:</label>' +
        '<input type="text" id="clave2" class="swal2-input" placeholder="🔑Clave"><br>' +
        '<label for="valor2">Valor 2:</label>' +
        '<input type="text" id="valor2" class="swal2-input" placeholder="🧾Valor"><br>' +
        '<label for="clave3">Clave 3:</label>' +
        '<input type="text" id="clave3" class="swal2-input" placeholder="🔑Clave"><br>' +
        '<label for="valor3">Valor 3:</label>' +
        '<input type="text" id="valor3" class="swal2-input" placeholder="🧾Valor"><br>' +
        '</div>' +
        '</div>' +
        '</form>',
      focusConfirm: false,
      preConfirm: () => {
        if (!this.validateFields()) {
          Swal.showValidationMessage('Todos los campos obligatorios deben ser completados.');
        } else {
          const atencionDoc = this.extractDataFromForm();
          this.turnosService.finalizarTurno(turno);
          this.turnosService.guardarAtencion(turno, atencionDoc);
        }
      },
      width: 900,  // Puedes ajustar este valor según tus necesidades
    });
  }
  
  validateFields(): boolean {
    const requiredFields = ['altura', 'peso', 'temperatura', 'presion'];
    for (const field of requiredFields) {
      const value = (document.getElementById(field) as HTMLInputElement).value;
      if (!value) {
        return false;
      }
    }
    return true;
  }
  
  extractDataFromForm(): any {
    const altura = (document.getElementById('altura') as HTMLInputElement).value;
    const peso = (document.getElementById('peso') as HTMLInputElement).value;
    const temperatura = (document.getElementById('temperatura') as HTMLInputElement).value;
    const presion = (document.getElementById('presion') as HTMLInputElement).value;
    const clave1 = (document.getElementById('clave1') as HTMLInputElement).value;
    const valor1 = (document.getElementById('valor1') as HTMLInputElement).value;
    const clave2 = (document.getElementById('clave2') as HTMLInputElement).value;
    const valor2 = (document.getElementById('valor2') as HTMLInputElement).value;
    const clave3 = (document.getElementById('clave3') as HTMLInputElement).value;
    const valor3 = (document.getElementById('valor3') as HTMLInputElement).value;
  
    return {
      altura,
      peso,
      temperatura,
      presion,
      datosDinamicos: [
        { clave: clave1, valor: valor1 },
        { clave: clave2, valor: valor2 },
        { clave: clave3, valor: valor3 },
      ],
    };
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

  getPacientes() {
    if (this.usuarioLogueado) {
      this.turnosService.getTurnosAceptadosByEspecialista(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          const pacientesConTurnos = turnos.map(turno => turno.pacienteDni);

          console.log("Pacientes con turno",pacientesConTurnos);

          this.usuariosService.getUsuarios()
            .subscribe(
              (usuarios: Usuario[]) => {
                console.log("Isiarops", usuarios);
                this.pacientes = usuarios.filter((usuario: Usuario) => {
                  return usuario.aceptado == "true" && pacientesConTurnos.includes(usuario.dni.toString());
                });
                console.log("Pacientes",this.pacientes);
              },
              (error) => {
                console.log('Error al obtener los usuarios:', error);
              }
            );
        });
    }
  }

  mostrarDatos(usuario: Usuario) {
  
    // Filtrar los turnos del paciente seleccionado
    const turnosPaciente = this.turnosDoctor.filter(turno => turno.pacienteDni == usuario.dni.toString() && turno.atendido == true);
  
    // Crear una tabla con la información de los turnos usando Bootstrap
    let tablaDatos = '<table class="table table-bordered">' +
      '<thead>' +
      '<tr>' +
      '<th>Especialidad</th>' +
      '<th>Especialista</th>' +
      '<th>Fecha</th>' +
      '<th>Hora</th>' +
      '<th>Reseña del Paciente</th>' +
      '<th>Altura</th>' +
      '<th>Peso</th>' +
      '<th>Presión</th>' +
      '<th>Temperatura</th>' +
      '<th>Datos Dinámicos</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>';
  
    turnosPaciente.forEach(turno => {
      tablaDatos += '<tr>' +
        `<td>${turno.especialidad || ''}</td>` +
        `<td>${turno.nombreDoctor || ''} ${turno.apellidoDoctor || ''}<br>(${turno.especialistaDni || ''})</td>` +
        `<td>${turno.fecha || ''}</td>` +
        `<td>${turno.hora || ''}</td>` +
        `<td>${turno.calificacionPaciente || 'Aun no cargo la reseña 😢'}</td>` +
        `<td>${turno.atencionDoc?.altura || ''}</td>` +
        `<td>${turno.atencionDoc?.peso || ''}</td>` +
        `<td>${turno.atencionDoc?.presion || ''}</td>` +
        `<td>${turno.atencionDoc?.temperatura || ''}</td>` +
        `<td>${this.formatDatosDinamicos(turno.atencionDoc?.datosDinamicos)}</td>` +
        '</tr>';
    });
  
    tablaDatos += '</tbody></table>';
  
    // Mostrar la tabla en un SweetAlert
    Swal.fire({
      title: `Historia clinica del paciente ${usuario.nombre} ${usuario.apellido}`,
      html: tablaDatos,
      width: 1500,
    });
  }

  formatDatosDinamicos(datosDinamicos: any) {
    if (!datosDinamicos || datosDinamicos.length === 0) {
      return '';
    }
  
    return datosDinamicos.map((item: any) => `${item.clave}: ${item.valor}`).join('<br>');
  }
  

}

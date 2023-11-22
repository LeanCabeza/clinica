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
  filtroFull: string = '';

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
      title: 'Ingrese datos de la atencion',
      html:
        '<input type="number" id="altura" class="swal2-input" placeholder="📏Altura"> <br>' +
        '<input type="number" id="peso" class="swal2-input" placeholder="⚖ Peso"><br>' +
        '<input type="number" id="temperatura" class="swal2-input" placeholder="🌡 Temperatura"><br>' +
        '<input type="number" id="presion" class="swal2-input" placeholder="🅿 Presión"><br>' +
        '<input type="text" id="clave1" class="swal2-input" placeholder="🔑Clave"><br>' +
        '<input type="text" id="valor1" class="swal2-input" placeholder="🧾Valor"><br>' +
        '<input type="text" id="clave2" class="swal2-input" placeholder="🔑Clave"><br>' +
        '<input type="text" id="valor2" class="swal2-input" placeholder="🧾Valor"><br>' +
        '<input type="text" id="clave3" class="swal2-input" placeholder="🔑Clave"><br>' +
        '<input type="text" id="valor3" class="swal2-input" placeholder="🧾Valor"><br>'
        ,
      focusConfirm: false,
      preConfirm: () => {
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
  
        const atencionDoc = {
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
        this.turnosService.finalizarTurno(turno);
        this.turnosService.guardarAtencion(turno,atencionDoc)
      },
    });
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



}

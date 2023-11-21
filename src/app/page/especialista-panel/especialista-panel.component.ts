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


}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';
import { animations } from 'src/app/animations/animations';
import { Turno } from 'src/app/models/turnos.interface';
import { TurnosService } from 'src/app/service/turnos.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  animations: [animations.scaleInCenter, animations.trackingInContract,animations.bounceTop]
})
export class MyProfileComponent implements OnInit {

  usuarioLogueado:any;
  diasAtencion: string[] = [];
  horariosAtencion: string[] = [];
  fotoPerfil = true;
  historialClinico: Turno[] = [];
  
  constructor(public authService:AuthService,
              public usuarioService:UsuariosService,
              public turnosService: TurnosService) { }

  ngOnInit(): void {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
      if (this.usuarioLogueado.tipoUsuario == "Especialista"){
        this.diasAtencion = this.usuarioLogueado.diasAtencion;
        this.horariosAtencion = this.usuarioLogueado.horariosAtencion;
      }
    });
    this.cargarHistorialClinico();
  }

  toggleDia(dia: string) {
    if (this.diasAtencion.includes(dia)) {
      this.diasAtencion = this.diasAtencion.filter(item => item !== dia);
    } else {
      this.diasAtencion.push(dia);
    }
  }

  cargarHistorialClinico() {
    if (this.usuarioLogueado) {
      this.turnosService.getHistoriaClinica(this.usuarioLogueado.dni.toString())
        .subscribe(historial => {
          this.historialClinico = historial.filter(item => item.atendido == true);
        });
    }
  }
  
  toggleHorario(horario: string) {
    if (this.horariosAtencion.includes(horario)) {
      this.horariosAtencion = this.horariosAtencion.filter(item => item !== horario);
    } else {
      this.horariosAtencion.push(horario);
    }
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

  guardarCambios() {

    Swal.fire({
        title: '¿Estás seguro de que quieres actualizar tu disponibilidad?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            this.usuarioService.actualizarDisponibilidad(this.usuarioLogueado, this.horariosAtencion, this.diasAtencion);
        }
    });
}

}

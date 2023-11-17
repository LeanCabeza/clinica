import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  usuarioLogueado:any;
  diasAtencion: string[] = [];
  horariosAtencion: string[] = [];
  
  constructor(public authService:AuthService,
              public usuarioService:UsuariosService) { }

  ngOnInit(): void {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
      if (this.usuarioLogueado.tipoUsuario == "Especialista"){
        this.diasAtencion = this.usuarioLogueado.diasAtencion;
        this.horariosAtencion = this.usuarioLogueado.horariosAtencion;
      }
    });
  }

  toggleDia(dia: string) {
    if (this.diasAtencion.includes(dia)) {
      this.diasAtencion = this.diasAtencion.filter(item => item !== dia);
    } else {
      this.diasAtencion.push(dia);
    }
  }
  
  toggleHorario(horario: string) {
    if (this.horariosAtencion.includes(horario)) {
      this.horariosAtencion = this.horariosAtencion.filter(item => item !== horario);
    } else {
      this.horariosAtencion.push(horario);
    }
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

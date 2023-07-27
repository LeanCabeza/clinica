import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("loginForm") loginForm:NgForm | undefined;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
  }
  
  usuario={
    email: "",
    password: ""
  }

  async login() {
    console.log("LLegue al login")
    try {
      const user = await this.usuariosService.getUsuarioByCredentials(this.usuario.email, this.usuario.password);
      if (user) {
        swal.fire('Registro exitoso!', 'Inicio de sesión exitoso. Redirigiendo...', 'success');
      } else {
        swal.fire('Error', 'Credenciales inválidas. Por favor, inténtalo de nuevo.', 'error');
      }
    } catch (error) {
      console.log('Error al verificar las credenciales:', error);
      swal.fire('Error', 'Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'error');
    }
  }


}
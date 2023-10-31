import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("loginForm") loginForm:NgForm | undefined;

  constructor(private usuariosService: UsuariosService,
             private router: Router) {}

  ngOnInit(): void {
  }
  
  usuario={
    email: "",
    password: ""
  }

  async login() {
    try {
      const user = await this.usuariosService.login(this.usuario.email, this.usuario.password);
      if (user) {
        swal.fire('Ingreso exitoso!', 'Inicio de sesión exitoso. Redirigiendo...', 'success');
        this.router.navigate(['home']);
      } else {
        swal.fire('Error', 'Credenciales inválidas. Por favor, inténtalo de nuevo.', 'error');
      }
    } catch (error) {
      swal.fire('Error', 'Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'error');
    }
  }


  ingresoRapido(numero: number) {
    switch (numero) {
      case 1:
        // Realizar la acción correspondiente al ingreso rápido 1
        this.usuario.email = 'paciente@paciente.com';
        this.usuario.password = 'paciente';
        break;
      case 2:
        // Realizar la acción correspondiente al ingreso rápido 2
        this.usuario.email = 'especialista@especialista.com';
        this.usuario.password = 'especialista';
        break;
      case 3:
        // Realizar la acción correspondiente al ingreso rápido 3
        this.usuario.email = 'admin@admin.com';
        this.usuario.password = 'admin';
        break;
      default:
        console.log('Número de ingreso rápido no válido');
    }
  }


}
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.interface';
import { AuthService } from 'src/app/service/auth.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild("loginForm") loginForm:NgForm | undefined;

  constructor(private usuariosService: UsuariosService,
             private router: Router,
             private authService: AuthService) {}

  ngOnInit(): void {
  }
  
  usuario={
    email: "",
    password: ""
  }


  login(){
      this.authService.login(this.usuario.email,this.usuario.password).then(res=>{
        Swal.fire('Ingreso exitoso!', 'Inicio de sesión exitoso. Redirigiendo...', 'success');
        this.router.navigate(['home']);
      }).catch(error=>{
        Swal.fire('Error', 'Credenciales inválidas o usuario no aceptado. Por favor, inténtalo de nuevo.', 'error');
      });
    }


  ingresoRapido(numero: number) {
    switch (numero) {
      case 1:
        this.usuario.email = 'admin@admin.com';
        this.usuario.password = 'admin123';
        break;
      case 2:
        this.usuario.email = 'especialista@especialista.com';
        this.usuario.password = 'especialista';
        break;
      case 3:
        this.usuario.email = 'erling@haaland.com';
        this.usuario.password = '123456';
        break;
      case 4:
        this.usuario.email = 'paciente@paciente.com';
        this.usuario.password = 'paciente';
        break;
      case 5:
        this.usuario.email = 'kylianmbappe@gmail.com';
        this.usuario.password = '123456';
        break;
      case 6:
        this.usuario.email = 'juanromanriquelme@gmail.com';
        this.usuario.password = '123456';
        break;
      default:
        console.log('Número de ingreso rápido no válido');
    }
  }


}
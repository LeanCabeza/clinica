import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario: Usuario= {
    nombre: "",
    apellido: "",
    email: "",
    edad: "",
    dni: "",
    password: "",
    obraSocial: "",
    especialidad: "",
    aceptado: "",
    fotoPerfil: "",
    tipoUsuario: "",
  };

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userService: UsuariosService
  ) {}

  ngOnInit(): void {
  }

  registrar() {
    if (!this.validarCampos()) {
      return;
    }
    this.usuario.tipoUsuario = "paciente"; 
    this.usuario.aceptado = "true";

    // Llama al método del servicio para crear el usuario
    this.userService.crearUsuario(this.usuario).then(() => {
      Swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
    }).catch(error => {
      Swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    });
  }

  validarCampos(): boolean {
    const { nombre, apellido, email, edad, dni, password, obraSocial } = this.usuario;

    if (!nombre || nombre.trim().length < 2) {
      Swal.fire('Error', 'El campo Nombre debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!apellido || apellido.trim().length < 2) {
      Swal.fire('Error', 'El campo Apellido debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!email || email.trim().length < 2) {
      Swal.fire('Error', 'El campo Email debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!edad || edad.toString().trim().length < 2) {
      Swal.fire('Error', 'El campo Edad debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!dni || dni.toString().trim().length < 2) {
      Swal.fire('Error', 'El campo DNI debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!password || password.trim().length < 2) {
      Swal.fire('Error', 'El campo Contraseña debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!obraSocial || obraSocial.trim().length < 2) {
      Swal.fire('Error', 'El campo Obra Social debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    // Agrega validaciones adicionales para los demás campos si es necesario...

    return true;
  }

  loginConGoogle() {
    this.authService.loginWithGoogle().then(res => {
      console.log('Se registró:', res);
    }).catch(error => {
      console.error('Error al registrar con Google:', error);
    });
  }

  openSnackBar() {
    this.snackBar.open('This is a snackbar', 'Cerrar', {
      duration: 3000,
      //extraClasses: ['center-snackbar']
    });
  }
}

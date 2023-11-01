import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';


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
    fotoPerfil1: "",
    fotoPerfil2: "",
    tipoUsuario: "",
  };
  
  tipo: string = "";
  selectedImage1: File | null;
  selectedImage2: File | null;
  flagAdmin: boolean = false;
  usuarioLogueado: Usuario | null;
  

  constructor(
    private snackBar: MatSnackBar,
    private userService: UsuariosService,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
      this.flagAdmin = this.usuarioLogueado?.tipoUsuario == "Admin"
    });
  }

  onFileSelected1(event: any) {
    this.selectedImage1 = event.target.files[0] as File;
  }

  onFileSelected2(event: any) {
    this.selectedImage2 = event.target.files[0] as File;
  }

  async registrarPaciente() {
    if (!this.validarCampos(false,false)) {
      return;
    }

    this.usuario.tipoUsuario = "Paciente";
    this.usuario.aceptado = "true";

    try {
      if (this.selectedImage1 && this.selectedImage2) {
        // Subir la imagen a Firebase Storage y obtener su URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        const imageRef2 = await this.userService.uploadImage(this.selectedImage2);
        this.usuario.fotoPerfil1 = imageRef1;
        this.usuario.fotoPerfil2 = imageRef2;
      }

      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(this.usuario);
      this.authService.register(this.usuario.email,this.usuario.password);

      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      if(this.flagAdmin == false)this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    }
  }

  async registrarEspecialista() {
    if (!this.validarCampos(true,false)) {
      return;
    }

    this.usuario.tipoUsuario = "Especialista";
    this.usuario.aceptado = "false";

    try {
      if (this.selectedImage1) {
        // Subir la imagen a Firebase Storage y obtener su URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        this.usuario.fotoPerfil1 = imageRef1;
      }

      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(this.usuario);
      this.authService.register(this.usuario.email,this.usuario.password);

      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      if(this.flagAdmin == false)this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    }
  }


  async registrarAdmin() {
    if (!this.validarCampos(false,true)) {
      return;
    }

    this.usuario.tipoUsuario = "Admin";
    this.usuario.aceptado = "true";

    try {
      if (this.selectedImage1) {
        // Subir la imagen a Firebase Storage y obtener su URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        this.usuario.fotoPerfil1 = imageRef1;
      }

      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(this.usuario);
      this.authService.register(this.usuario.email,this.usuario.password);

      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      if(this.flagAdmin == false)this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    }
  }

  validarCampos(especialista: boolean, admin:boolean): boolean {
    const { nombre, apellido, email, edad, dni, password, obraSocial, especialidad } = this.usuario;

    if (!nombre || nombre.trim().length < 2) {
      swal.fire('Error', 'El campo Nombre debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!apellido || apellido.trim().length < 2) {
      swal.fire('Error', 'El campo Apellido debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!email || email.trim().length < 2) {
      swal.fire('Error', 'El campo Email debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!edad || edad.toString().trim().length < 2) {
      swal.fire('Error', 'El campo Edad debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!dni || dni.toString().trim().length < 2) {
      swal.fire('Error', 'El campo DNI debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if (!password || password.trim().length < 2) {
      swal.fire('Error', 'El campo Contraseña debe tener al menos 2 caracteres.', 'error');
      return false;
    }

    if ( admin == false && especialista == false)
      if (!obraSocial || obraSocial.trim().length < 2) {
        swal.fire('Error', 'El campo Obra Social debe tener al menos 2 caracteres.', 'error');
        return false;
      }

    if ( admin == false && especialista  == true )
      if ( !especialidad || especialidad.trim().length < 2) {
        swal.fire('Error', 'El campo Especialidad debe tener al menos 2 caracteres.', 'error');
        return false;
    }

    return true;
  }

  openSnackBar() {
    this.snackBar.open('This is a snackbar', 'Cerrar', {
      duration: 3000,
      //extraClasses: ['center-snackbar']
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
    diasAtencion: [],
    horariosAtencion:[],
  };

  usuarioForm: FormGroup;
  especialistaForm: FormGroup;
  adminForm: FormGroup;
  tipo: string = "Especialista";
  selectedImage1: File | null;
  selectedImage2: File | null;
  flagAdmin: boolean = false;
  usuarioLogueado: Usuario | null;
  diasAtencion: string[] = ['Lunes'];
  horariosAtencion: string[] = ['9:00 a 13:00'];
  

  constructor(
    private snackBar: MatSnackBar,
    private userService: UsuariosService,
    private router: Router,
    private authService:AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18)]],
      dni: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      obraSocial: [''],
    });

    this.especialistaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18)]],
      dni: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      especialidad: [''],
    });

    this.adminForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18)]],
      dni: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });


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

async registrarPaciente() {

    const usuario = { ...this.usuarioForm.value };
    usuario.tipoUsuario = 'Paciente';
    usuario.aceptado = 'true';

    console.log("Registrar Paciente Form",usuario);

    try {
      if (this.selectedImage1 && this.selectedImage2) {
        // Subir la imagen a Firebase Storage y obtener su URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        const imageRef2 = await this.userService.uploadImage(this.selectedImage2);
        usuario.fotoPerfil1 = imageRef1;
        usuario.fotoPerfil2 = imageRef2;
      }

      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(usuario);
      if (this.usuarioLogueado?.tipoUsuario == "Admin")
        {await this.authService.registerWithoutLogin(usuario.email, usuario.password,this.usuarioLogueado)}
      else{await this.authService.register(usuario.email, usuario.password)}


      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      if (!this.flagAdmin) this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    }
  }

  async registrarEspecialista() {

    const usuario = { ...this.especialistaForm.value };
    usuario.tipoUsuario = "Especialista";
    usuario.aceptado = "false";
    usuario.diasAtencion = this.diasAtencion;
    usuario.horariosAtencion = this.horariosAtencion;
    usuario.especialidad = this.usuario.especialidad;

    console.log("USUARIO EN EL registrarEspecialista", usuario)

    try {
      if (this.selectedImage1) {
        // Subir la imagen a Firebase Storage y obtener su URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        usuario.fotoPerfil1 = imageRef1;
      }

      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(usuario);
      //this.authService.register(usuario.email,usuario.password);

      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      this.usuario.diasAtencion = [];
      this.usuario.horariosAtencion = [];
      if(this.flagAdmin == false)this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    }
  }


  async registrarAdmin() {

    const usuario = { ...this.adminForm.value };
    usuario.tipoUsuario = "Admin";
    usuario.aceptado = "true";

    console.log("Registrar Admin Form",usuario);

    try {
      if (this.selectedImage1) {
        // Subir la imagen a Firebase Storage y obtener su URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        usuario.fotoPerfil1 = imageRef1;
      }

      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(usuario);
      this.authService.register(usuario.email,usuario.password);

      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      if(this.flagAdmin == false)this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    }
  }


  openSnackBar() {
    this.snackBar.open('This is a snackbar', 'Cerrar', {
      duration: 3000,
      //extraClasses: ['center-snackbar']
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


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
  tipo: string = "";
  selectedImage1: File | null;
  selectedImage2: File | null;
  flagAdmin: boolean = false;
  usuarioLogueado: Usuario | null;
  diasAtencion: string[] = ['Lunes'];
  horariosAtencion: string[] = ['9:00 a 13:00'];
  showSpinner = false;
  showButtons: boolean = true;
  showForms: boolean = false;
  

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

  async showCaptcha(): Promise<boolean> {
    // Generar dos números aleatorios entre 1 y 10
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const sumaCorrecta = num1 + num2;
  
    try {
      const result = await Swal.fire({
        title: "Verificación de Humano 🤖!",
        html: `Por favor, ingrese la suma de los siguientes números:<br>${num1} + ${num2}`,
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
          pattern: "[0-9]+",
        },
        showCancelButton: true,
        confirmButtonText: "Verificar",
        showLoaderOnConfirm: true,
        preConfirm: (respuesta) => {
          // Validar que la respuesta sea un número
          const inputNumber = parseInt(respuesta, 10);
  
          if (isNaN(inputNumber)) {
            Swal.showValidationMessage("Ingrese un número válido.");
          } else if (inputNumber !== sumaCorrecta) {
            Swal.showValidationMessage("La suma ingresada es incorrecta.");
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });
  
      if (result.isConfirmed) {
        Swal.fire({
          title: "Correcto!",
          text: "La verificación ha sido exitosa.",
          icon: "success",
        });
        console.log("RETORNE TRUE CAPCHA");
        return true;
      } else {
        console.log("RETORNE False CAPCHA");
        return false;
      }
    } catch (error) {
      console.error('Error during captcha verification:', error);
      return false;
    }
  }

  async registrarPaciente() {
    // Show captcha and wait for the user's response
    const captchaValid: boolean = await this.showCaptcha();
  
    if (!captchaValid) {
      swal.fire('No pasaste el Captcha', 'Sos sospechoso de ser un robot 🤖.', 'error');
      return;
    }
  
    this.showSpinner = true; // Muestra el spinner al principio del proceso
  
    const usuario = { ...this.usuarioForm.value };
    usuario.tipoUsuario = 'Paciente';
    usuario.aceptado = 'true';
  
    console.log("Registrar Paciente Form", usuario);
  
    try {
      if (this.selectedImage1 && this.selectedImage2) {
        // Subir las imágenes a Firebase Storage y obtener sus URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        const imageRef2 = await this.userService.uploadImage(this.selectedImage2);
        usuario.fotoPerfil1 = imageRef1;
        usuario.fotoPerfil2 = imageRef2;
      }
  
      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(usuario);
  
      if (this.usuarioLogueado?.tipoUsuario == "Admin") {
        await this.authService.registerWithoutLogin(usuario.email, usuario.password, this.usuarioLogueado);
      } else {
        await this.authService.register(usuario.email, usuario.password);
      }
  
      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      if (!this.flagAdmin) this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    } finally {
      // Independientemente del resultado, oculta el spinner al final del proceso
      this.showSpinner = false;
    }
  }

  async registrarEspecialista() {
    this.showSpinner = true; // Muestra el spinner al principio del proceso
  
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
  
      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      this.usuario.diasAtencion = [];
      this.usuario.horariosAtencion = [];
      if (this.flagAdmin == false) this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    } finally {
      // Independientemente del resultado, oculta el spinner al final del proceso
      this.showSpinner = false;
    }
  }
  

  async registrarAdmin() {
    this.showSpinner = true; // Muestra el spinner al principio del proceso
  
    const usuario = { ...this.adminForm.value };
    usuario.tipoUsuario = "Admin";
    usuario.aceptado = "true";
  
    console.log("Registrar Admin Form", usuario);
  
    try {
      if (this.selectedImage1) {
        // Subir la imagen a Firebase Storage y obtener su URL de descarga
        const imageRef1 = await this.userService.uploadImage(this.selectedImage1);
        usuario.fotoPerfil1 = imageRef1;
      }
  
      // Crear el usuario en la base de datos de Firestore
      await this.userService.crearUsuario(usuario);
      await this.authService.register(usuario.email, usuario.password);
  
      swal.fire('Registro exitoso!', 'El usuario ha sido creado.', 'success');
      if (this.flagAdmin == false) this.router.navigate(['home']);
    } catch (error) {
      swal.fire('Error', 'Hubo un problema al crear el usuario.', 'error');
      console.error('Error al crear el usuario:', error);
    } finally {
      // Independientemente del resultado, oculta el spinner al final del proceso
      this.showSpinner = false;
    }
  }


  openSnackBar() {
    this.snackBar.open('This is a snackbar', 'Cerrar', {
      duration: 3000,
      //extraClasses: ['center-snackbar']
    });
  }
}

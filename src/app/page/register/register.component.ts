import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.interface';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { animations } from 'src/app/animations/animations';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [animations.scaleInCenter, animations.rotateVertLeft]
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
    const imageNames = ["2bg48","2cg58","2cgyx","2g7nm","2gyb6","3b4we","3bfnd","3bx86","3cpwb","3d7bd","3xcgg","3ygde","4cfw8","4d22m","4dw3w","4egem","4f8yp","4fc36","4gb3f","5bb66","enn7n","ennmm","enpw2","ep85x","eppg3","ewcf5","f35xp","f6ww8","f83pn","f85y3","f8f8g","gcx6f","gd8fb","gm7n8","gn2d3","gnbn4","gnc3n","gng6e","gp7c5","m8m4x","mgdwb","mgw3n","mmc5n","mmfm6","mmg2m","mmg38","mmy5n","ngn26","nm46n","nn4wx","nwg2m","nwncn","nxn4f","nxxf8","ny3nn","p6mn8","pcpg6","pdyc8"];

    let randomImageName = imageNames[Math.floor(Math.random() * imageNames.length)];
  
    try {
      const result = await Swal.fire({
        title: "Verificación de Humano 🤖!",
        html: `Por favor, ingrese el texto que ve en la siguiente imagen:<br><img src="/assets/images/captcha/${randomImageName}.png" alt="Captcha Image" width="200" height="80">`,
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Verificar",
        showLoaderOnConfirm: true,
        preConfirm: (respuesta) => {
          // Validar que la respuesta sea el nombre correcto de la imagen
          if (respuesta !== randomImageName) {
            Swal.showValidationMessage("Texto ingresado incorrecto, volve a intentarlo.");
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
    // Show captcha and wait for the user's response
    const captchaValid: boolean = await this.showCaptcha();

    if (!captchaValid) {
      swal.fire('No pasaste el Captcha', 'Sos sospechoso de ser un robot 🤖.', 'error');
      return;
    }
  
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
    // Show captcha and wait for the user's response
    const captchaValid: boolean = await this.showCaptcha();

    if (!captchaValid) {
      swal.fire('No pasaste el Captcha', 'Sos sospechoso de ser un robot 🤖.', 'error');
      return;
    }
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

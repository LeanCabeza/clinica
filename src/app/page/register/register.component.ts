import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  usuario = {
    nombre: "",
    apellido: "",
    email: "",
    edad: "",
    dni: "",
    password: "",
    obraSocial: ""
  }
  
  constructor(private authService: AuthService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.openSnackBar();
  }

  registrar(){
    console.log(this.usuario);
    const {email ,password} = this.usuario;  
  }

  loginConGoogle(){
    this.authService.loginWithGoogle().then(res =>{
      console.log("Se registro:",res);
    })
  }

  openSnackBar() {
    this.snackBar.open('This is a snackbar', 'Cerrar', {
      duration: 3000,
      //extraClasses: ['center-snackbar']
    });
  }

}

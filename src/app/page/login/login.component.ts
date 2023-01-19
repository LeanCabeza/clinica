import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mensajeLoggeo: string = '';
  @ViewChild("loginForm") loginForm:NgForm | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }
  
  usuario={
    email: "",
    password: ""
  }

  loginConGoogle(){
    this.authService.loginWithGoogle().then(res =>{
      console.log("Se loggeo:",res);
    })
  }

  login(){
    console.log(this.usuario);
    const {email ,password} = this.usuario;
    this.authService.login(email,password).then(res =>{
      console.log("Se loggeo:",res);
    })
  }

}
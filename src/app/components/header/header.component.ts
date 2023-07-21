import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logged = false;
  emailUsuario = "";

  constructor( private  authService: AuthService) {
   }

  ngOnInit(): void {
    this.obtenerUsuarioLoggeado();
  }

  obtenerUsuarioLoggeado(){
    /*this.authService.getUserLogged().subscribe(user => {
      console.log(user?.email);
      if (user?.email != null) {
        this.logged = true; 
        this.emailUsuario = user.email 
      } else this.logged = false;
    })*/
  }

  logout(){
    /*this.authService.logout();
    this.logged = false;
    this.snackbar.open("Saliendo...", 'Cerrar',{
      duration:3000
    });*/
  }

}

import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {

  usuarios: Usuario[]

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  aceptarUsuario(){

  }

  rechazarUsuario(){
    
  }

  getUsuarios() {
    this.usuariosService.getUsuarios()
      .subscribe(
        (usuarios: Usuario[]) => {
          this.usuarios = usuarios;
        },
        (error) => {
          console.log('Error al obtener los usuarios:', error);
        }
      );
  }

}

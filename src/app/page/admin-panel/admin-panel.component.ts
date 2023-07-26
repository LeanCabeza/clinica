import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {

  usuarios: Usuario[];
  especialistas: Usuario[];

  constructor(private usuariosService: UsuariosService) { }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuariosService.getUsuarios()
      .subscribe(
        (usuarios: Usuario[]) => {
          // Filtrar usuarios según el valor de la especialidad
          this.usuarios = usuarios.filter((usuario: Usuario) =>  usuario.aceptado == "true");
          this.especialistas = usuarios.filter((usuario: Usuario) => usuario.especialidad != null && usuario.aceptado == null);
        },
        (error) => {
          console.log('Error al obtener los usuarios:', error);
        }
      );
  }

  actualizarEstado(dni: string, flag: string): void {
    const dniParse = Number(dni);
    this.usuariosService.actualizarAceptadoPorDNI(dniParse, flag)
      .then(() => {
        swal.fire('Procesamiento exitoso!', (flag === 'true') ? 'El usuario fue aceptado correctamente' : 'El usuario fue rechazado correctamente', 'success');
        this.getUsuarios();
      })
      .catch((error) => {
        console.error('Error al actualizar el estado:', error);
        this.getUsuarios();
      });
  }
}

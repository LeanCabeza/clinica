import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.interface';
import { AuthService } from 'src/app/service/auth.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuarioLogueado: Usuario | null;
  userIcon = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
      this.userIcon =
        this.usuarioLogueado?.tipoUsuario === 'Especialista'
          ? '🩺'
          : this.usuarioLogueado?.tipoUsuario === 'Admin'
          ? '🔨'
          : '🟢';
    });
  }

  logout() {
    this.authService.logout();
    swal.fire(
      'Desloggeo exitoso!',
      'Te desloggeaste correctamente, te esperamos pronto ❤',
      'success'
    );
  }
}
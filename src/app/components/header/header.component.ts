import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuarioLogueado: Usuario | null = null;
  userIcon =  "";

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.usuariosService.usuarioLogueado$.subscribe((usuario) => {
      this.usuarioLogueado = usuario;
      this.userIcon = this.usuarioLogueado?.tipoUsuario === 'especialista' ? '🩺' : this.usuarioLogueado?.tipoUsuario === 'admin' ? '🔨' : '🟢';
    });
  }

  logout() {
    this.usuariosService.logout();
    swal.fire('Desloggeo exitoso!', 'Te desloggeaste correctemante, te esperamos pronto ❤', 'success');
  }

}

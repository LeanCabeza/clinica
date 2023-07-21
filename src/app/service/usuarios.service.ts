import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioColleccion!: AngularFirestoreCollection<Usuario>;
  usuarios!: Observable<Usuario[]>;

  constructor(private db: AngularFirestore) {
    this.usuarioColleccion = this.db.collection<Usuario>('usuarios'); // Inicializa la colección aquíOpción adicional para inicializar la lista de usuarios
  }

  getUsuarios() {
    return true;
  }

  crearUsuario(usuario: Usuario) {
    console.log("Tratando de crear usuario");
    return this.usuarioColleccion?.add(usuario);
  }
}

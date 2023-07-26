import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CommonModule } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioColleccion!: AngularFirestoreCollection<Usuario>;
  usuarios!: Observable<Usuario[]>;

  constructor( 
    private db: AngularFirestore,
    private storage: AngularFireStorage) {
    this.usuarioColleccion = this.db.collection<Usuario>('usuarios'); // Inicializa la colección aquíOpción adicional para inicializar la lista de usuarios
  }

  async uploadImage(image: File): Promise<string> {
    const storageRef = this.storage.ref(`user-profile-images/${image.name}`);
    const task = await storageRef.put(image);
    return task.ref.getDownloadURL();
  }

  getUsuarios() {
    this.usuarioColleccion = this.db.collection<Usuario>('usuarios', ref => ref);
    return this.usuarioColleccion.valueChanges();
  }

  crearUsuario(usuario: Usuario) {
    return this.usuarioColleccion?.add(usuario);
  }

}

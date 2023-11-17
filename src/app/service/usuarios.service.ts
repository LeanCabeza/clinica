import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.interface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarioColleccion!: AngularFirestoreCollection<Usuario>;
  usuarios!: Observable<Usuario[]>;
  private usuarioLogueadoSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);
  usuarioLogueado$: Observable<Usuario | null> = this.usuarioLogueadoSubject.asObservable(); // Expone el Observable para suscribirse
  private tiempoExpiracionSesion: number = 30 * 60 * 1000; // 30 minutos en milisegundos
  private usuarioLocalStorageKey = 'usuarioLogueado'; // Clave para guardar el usuario en el LocalStorage

  constructor( 
    private db: AngularFirestore,
    private storage: AngularFireStorage) {
      this.usuarioColleccion = this.db.collection<Usuario>('usuarios');
      const usuarioGuardado = localStorage.getItem(this.usuarioLocalStorageKey);
      if (usuarioGuardado) {
        this.usuarioLogueadoSubject.next(JSON.parse(usuarioGuardado));
        this.setTiempoExpiracion();
      }
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

  getEspecialistaByEspecialidad(especialidad: string): Observable<Usuario[]> {
    return this.usuarioColleccion
      .valueChanges()
      .pipe(
        map((usuarios: Usuario[]) => usuarios.filter((usuario: Usuario) => usuario.especialidad === especialidad))
      );
  }

  crearUsuario(usuario: Usuario) {
    return this.usuarioColleccion?.add(usuario);
  }

  actualizarAceptadoPorDNI(dni: number, flag: string): Promise<void> {
    console.log("Entre al servicio");
    return new Promise<void>((resolve, reject) => {
      this.db.collection('usuarios', ref => ref.where('dni', '==', dni))
        .get()
        .toPromise()
        .then((querySnapshot) => {
          querySnapshot?.forEach((doc) => {
            doc.ref.update({ aceptado: flag }).then(() => {resolve()});
          });
        })
        .catch((error) => reject(error));
    });
  }

  login(email: string, password: string): Promise<Usuario | null> {
    return new Promise<Usuario | null>((resolve, reject) => {
        this.db.collection<Usuario>('usuarios', ref => ref.where('email', '==', email).where('password', '==', password).where("aceptado","==","true"))
        .get()
        .toPromise()
        .then((querySnapshot) => {
          if (querySnapshot?.empty) {
            resolve(null);
          } else {
            querySnapshot?.forEach((doc) => {
              const usuario = doc.data() as Usuario;
              this.usuarioLogueadoSubject.next(usuario); // Emitir el usuario logueado a través del BehaviorSubject
              localStorage.setItem(this.usuarioLocalStorageKey, JSON.stringify(usuario)); // Guardar usuario en el LocalStorage
              this.setTiempoExpiracion(); // Establecer el tiempo de expiración para la sesión
              resolve(usuario);
            });
          }
        })
        .catch((error) => reject(error));
    });
  }

  private setTiempoExpiracion(): void {
    setTimeout(() => {
      this.usuarioLogueadoSubject.next(null); // Usuario expirado, emite null a través del BehaviorSubject
      localStorage.removeItem(this.usuarioLocalStorageKey); // Eliminar usuario del LocalStorage al expirar
    }, this.tiempoExpiracionSesion);
  }

  getUsuarioLogueado(): Usuario | null {
    return this.usuarioLogueadoSubject.getValue();
  }

  logout(): void {
    this.usuarioLogueadoSubject.next(null); 
    localStorage.removeItem(this.usuarioLocalStorageKey);
  }

  actualizarDisponibilidad(usuario: Usuario,horarios: Array<string>,dias:Array<string>) {
    const query = this.db.collection<Usuario>('usuarios', ref =>
      ref.where('dni', '==', usuario.dni)
         .where('nombre', '==', usuario.nombre)
         .where('apellido', '==', usuario.apellido)
         .where('email', '==', usuario.email)
    );

    query.get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({
          horariosAtencion: horarios,
          diasAtencion: dias
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Disponibilidad Actualizada...",
            text: "Se actualizo la disponibilidad",
          });
        }).catch(error => {
          console.error('Error al actualizar:', error);
        });
      });
    });
  }

}
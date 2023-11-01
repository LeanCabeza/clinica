import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Usuario } from '../models/usuario.interface';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private actualUserSubject = new BehaviorSubject<Usuario | null>(null);
  public actualUser$ = this.actualUserSubject.asObservable();

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) {
    this.auth.setPersistence('local'); // Configura la autenticación persistente

    // Verifica si ya hay un usuario autenticado al cargar la aplicación
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // El usuario está autenticado, obtén sus datos y notifica a los observadores
        this.obtenerDatosUsuario(user.email);
      } else {
        // No hay un usuario autenticado, establece el usuario en null
        this.actualUserSubject.next(null);
      }
    });
  }

  async obtenerDatosUsuario(email: any) {
    // Realiza una consulta en Firestore para buscar un documento con el correo electrónico proporcionado
    const usersCollection = this.firestore.collection('usuarios');
    const userQuerySnapshot = await usersCollection.ref
      .where('email', '==', email)
      .get();

    if (!userQuerySnapshot.empty) {
      // Si la consulta no está vacía, significa que se encontró un usuario con ese correo electrónico
      const userData: any = userQuerySnapshot.docs[0].data();

      if (userData && userData.aceptado == "true") {
        // El usuario está activo, guardar el rol en "actualRole"
        this.actualUserSubject.next(userData);
        // Guardar el correo electrónico actual
      } else {
        this.actualUserSubject.next(null); // Establece el usuario en null
        // El usuario no está activo, lanzar un error
        throw new Error('El usuario no está aceptado');
      }
    } else {
      // No se encontró un usuario con el correo electrónico proporcionado, lanzar un error
      this.actualUserSubject.next(null); // Establece el usuario en null
      throw new Error('El usuario no existe');
    }
  }

  async register(email: string, password:string){
    try {
        return await this.auth.createUserWithEmailAndPassword(email,password);
    } catch (error) {
      throw error;
    }
  }


  async login(email: string, password: string) {
    try {
      // Iniciar sesión en Firebase
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      // Obtener los datos del usuario
      await  this.obtenerDatosUsuario(email);
    } catch (error) {
      throw  error;
    }
  }

  logout(){
    this.actualUserSubject.next(null); // Establece el usuario en null
    this.auth.signOut();
  }

  getUserLogged(){
    return this.auth.authState;
  }

}
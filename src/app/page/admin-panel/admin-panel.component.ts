import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.interface';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  usuarios: Usuario[]; // Esta propiedad almacenará la lista de usuarios obtenidos de Firebase

  constructor() { }

  ngOnInit(): void {
    // Aquí puedes obtener los usuarios de Firebase y asignarlos a this.usuarios
    // Por ejemplo, puedes usar el servicio AngularFire para interactuar con Firebase
    // this.usuarios = this.afs.collection('usuarios').valueChanges(); // Ejemplo usando AngularFirestore (Firestore de Firebase)
  }

  aceptarUsuario(usuario: Usuario) {
    // Aquí implementarías la lógica para aceptar al usuario especialista
    // Puedes enviar una actualización a Firebase o realizar otras acciones
  }

  rechazarUsuario(usuario: Usuario) {
    // Aquí implementarías la lógica para rechazar al usuario especialista
    // Puedes enviar una actualización a Firebase o realizar otras acciones
  }

}

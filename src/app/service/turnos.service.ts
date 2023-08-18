import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Turno } from '../models/turnos.interface';

@Injectable()
export class TurnosService {

  constructor(private firestore: AngularFirestore) { }

  getTurnosByEspecialista(dni?: string, fecha?: string) {
    console.log("Tratando de obtener turnos firebase, servicio, dni:", dni);

    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('especialistaDni', '==', dni)
        .where('fecha', '==', fecha)
    ).valueChanges();
  }

  getHistoriaClinica(dni: string) {
    console.log("Tratando de obtener turnos firebase, servicio, dni:", dni);

    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('pacienteDni', '==', dni)
        .where('atendido', '==', true)
    ).valueChanges();
  }

  getProximosTurnos(dni: string) {
    console.log("Tratando de obtener turnos firebase, servicio, dni:", dni);

    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('pacienteDni', '==', dni)
        .where('atendido', '==', false)
    ).valueChanges();
  }

  guardarTurno(turno: Turno) {
    return this.firestore.collection('turnos').add(turno);
  }

  cancelarTurno(turno: Turno) {
    const query = this.firestore.collection<Turno>('turnos', ref =>
      ref.where('fecha', '==', turno.fecha)
         .where('hora', '==', turno.hora)
         .where('especialistaDni', '==', turno.especialistaDni)
         .where('pacienteDni', '==', turno.pacienteDni)
         .where('especialidad', '==', turno.especialidad)
    );

    query.get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete().then(() => {
          console.log('Documento eliminado correctamente');
        }).catch(error => {
          console.error('Error al eliminar el documento:', error);
        });
      });
    });
  }

  calificarTurno(turno: Turno,calificacion: string) {
    console.log(turno,calificacion)
    const query = this.firestore.collection<Turno>('turnos', ref =>
      ref.where('fecha', '==', turno.fecha)
         .where('hora', '==', turno.hora)
         .where('especialistaDni', '==', turno.especialistaDni)
         .where('pacienteDni', '==', turno.pacienteDni)
         .where('especialidad', '==', turno.especialidad)
    );
  
    query.get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({
          calificacionUsuario: calificacion
        }).then(() => {
          console.log('Campo "calificacionPaciente" modificado correctamente');
        }).catch(error => {
          console.error('Error al modificar el campo "calificacionPaciente":', error);
        });
      });
    });
  }


}
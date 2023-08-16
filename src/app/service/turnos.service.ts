    import { Injectable } from '@angular/core';
    import { AngularFirestore } from '@angular/fire/compat/firestore';
    import { Turno } from '../models/turnos.interface';
    
    @Injectable()
    export class TurnosService {
    
    constructor(private firestore: AngularFirestore) { }
    
    getTurnosByEspecialista(dni: string, fecha: string) {
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
    
    
    }
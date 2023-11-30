import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Turno } from '../models/turnos.interface';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map , distinct} from 'rxjs/operators';




@Injectable()
export class TurnosService {

  constructor(private firestore: AngularFirestore) { }

  getTurnosByEspecialista(dni?: string, fecha?: string) {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('especialistaDni', '==', dni)
        .where('fecha', '==', fecha)
    ).valueChanges();
  }

  getTurnosPendientesAceptarByEspecialista(dni?: string) {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('especialistaDni', '==', dni)
      .where('confirmacionDoctor','==','Pendiente Confirmacion')
    ).valueChanges();
  }

  getTurnosAceptadosByEspecialista(dni?: string) {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('especialistaDni', '==', dni)
      .where('confirmacionDoctor','!=','Pendiente Confirmacion')
    ).valueChanges();
  }

  getHistoriaClinica(dni: string) {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('pacienteDni', '==', dni)
        .where('atendido', '==', true)
    ).valueChanges();
  }

  getHistoriaFull() {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('atendido', '==', true)
    ).valueChanges();
  }

  getProximosTurnos(dni: string) {
    console.log("Tratando de obtener turnos firebase, servicio, dni:", dni);
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('pacienteDni', '==', dni)
        .where('atendido', '==', false)
    ).valueChanges();
  }

  
  getProximosTurnosFull() {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('atendido', '==', false)
    ).valueChanges();
  }

  guardarTurno(turno: Turno) {
    console.log("este es el turno que se trata de guardar",turno);
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
          calificacionPaciente: calificacion
        }).then(() => {
          console.log('Campo "calificacionPaciente" modificado correctamente');
        }).catch(error => {
          console.error('Error al modificar el campo "calificacionPaciente":', error);
        });
      });
    });
  }

  aceptarTurno(turno: Turno) {
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
          confirmacionDoctor: 'Aceptado'
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Turno Aceptado...",
            text: "Se Acepto el turno correctamente",
          });
        }).catch(error => {
          console.error('Error al aceptar el turno:', error);
        });
      });
    });
  }

  guardarAtencion(turno: Turno, atencion: any) {
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
          atencionDoc: atencion
        })
      });
    });
  }

  finalizarTurno(turno: Turno) {
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
          confirmacionDoctor: 'Atendido',
          atendido: true
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Turno Finalizado...",
            text: "Se finalizo el turno",
          });
        }).catch(error => {
          console.error('Error al finalizar el turno:', error);
        });
      });
    });
  }

  rechazarTurno(turno: Turno) {
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
          confirmacionDoctor: 'Rechazado'
        }).then(() => {
          Swal.fire({
            icon: "success",
            title: "Turno RECHAZADO...",
            text: "Se rechazo el turno correctamente",
          });
        }).catch(error => {
          console.error('Error al rechazar el turno:', error);
        });
      });
    });
  }

  //SECCION INFORMES
  
    // Obtener cantidad de turnos por especialidad
  getCantidadTurnosPorEspecialidad(especialidad: string): Observable<number> {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('especialidad', '==', especialidad)
    ).valueChanges().pipe(map(turnos => turnos.length));
  }

  getCantidadTurnosPorDia(dia: string): Observable<number> {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('fecha', '==', dia)
    ).valueChanges().pipe(map(turnos => turnos.length));
  }

  // Obtener cantidad de turnos por día
  getDiasConTurnos(): Observable<string[]> {
    return this.firestore.collection<Turno>('turnos').valueChanges().pipe(
      map(turnos => turnos.map(turno => turno.fecha as string)),
      distinct()  // Para obtener días únicos
    );
  }
  // Obtener cantidad de turnos solicitados por médico en un lapso de tiempo
  getCantidadTurnosSolicitadosPorMedico(dni: string, fechaInicio: string, fechaFin: string): Observable<number> {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('especialistaDni', '==', dni)
        .where('fecha', '>=', fechaInicio)
        .where('fecha', '<=', fechaFin)
    ).valueChanges().pipe(map(turnos => turnos.length));
  }

  // Obtener cantidad de turnos finalizados por médico en un lapso de tiempo
  getCantidadTurnosFinalizadosPorMedico(dni: string, fechaInicio: string, fechaFin: string): Observable<number> {
    return this.firestore.collection<Turno>('turnos', ref =>
      ref.where('especialistaDni', '==', dni)
        .where('atendido', '==', true)
        .where('fecha', '>=', fechaInicio)
        .where('fecha', '<=', fechaFin)
    ).valueChanges().pipe(map(turnos => turnos.length));
  }


}
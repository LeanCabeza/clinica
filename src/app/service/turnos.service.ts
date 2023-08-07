    import { Injectable } from '@angular/core';
    import { Turno } from '../models/turnos.interface';
    import { AngularFirestore } from '@angular/fire/compat/firestore';
    
    @Injectable()
    export class TurnosService {
    
    constructor(private firestore: AngularFirestore) { }
    
    getTurnosByEspecialista(dni: string) {
        return this.firestore.collection<Turno>('turnos', ref => ref.where('dni', '==', dni)).valueChanges();
    }
    
    
    }
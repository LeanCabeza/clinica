import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { AuthService } from 'src/app/service/auth.service';
import { TurnosService } from 'src/app/service/turnos.service';

@Component({
  selector: 'app-especialista-panel',
  templateUrl: './especialista-panel.component.html',
  styleUrls: ['./especialista-panel.component.css']
})
export class EspecialistaPanelComponent implements OnInit {
  
  usuarioLogueado: any;
  proximosTurnos: Turno[] = [];
  mostrarAceptarRechazar = true;
  mostrarTurnos = false;

  constructor(public authService:AuthService,
              public turnosService: TurnosService            
  ) { }

  ngOnInit() {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
    });
    this.cargarTurnosPendientesAceptar();
  }


  cargarTurnosPendientesAceptar() {
    if (this.usuarioLogueado) {
      this.turnosService.getTurnosPendientesAceptarByEspecialista(this.usuarioLogueado.dni.toString())
        .subscribe(turnos => {
          this.proximosTurnos = turnos;
        });
    }
  }
  

}

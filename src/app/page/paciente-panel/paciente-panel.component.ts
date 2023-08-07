import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Turno } from 'src/app/models/turnos.interface';
import { Usuario } from 'src/app/models/usuario.interface';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-paciente-panel',
  templateUrl: './paciente-panel.component.html',
  styleUrls: ['./paciente-panel.component.css']
})
export class PacientePanelComponent implements OnInit {

  especialidades: string[] = ['Pediatria', 'Traumatologia', 'Medico Clinico'];
  doctores: any[];
  turnosDisponibles: any[];
  especialidadSeleccionada: string;
  doctorSeleccionado: string;


  constructor(private usuariosService: UsuariosService) { }

  ngOnInit() {
  }


  cargarDoctores() {
    console.log("Cargando doctores");
    this.usuariosService.getEspecialistaByEspecialidad(this.especialidadSeleccionada)
      .subscribe(doctores => {
        this.doctores = doctores;
      });
  }

  cargarTurnosOcupados() {
    // Aquí debes consultar a Firebase para obtener los turnos ocupados del doctor seleccionado
  }

    reservarTurno(){}

 

}

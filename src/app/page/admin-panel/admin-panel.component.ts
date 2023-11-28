import { Component, OnInit } from '@angular/core';
import { Turno } from 'src/app/models/turnos.interface';
import { Usuario } from 'src/app/models/usuario.interface';
import { AuthService } from 'src/app/service/auth.service';
import { TurnosService } from 'src/app/service/turnos.service';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';
import swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent implements OnInit {

  usuarios: Usuario[];
  especialistas: Usuario[];
  flagAdmin: boolean = false;
  usuarioLogueado: Usuario | null;
  mostrarUsuarios = true;
  mostrarAceptarEspecialistas = false;
  mostrarRegistrarUsuarios = false;
  mostrarTurnos = false;
  historialClinico: Turno[] = [];
  showSpinner = false;

  constructor(private usuariosService: UsuariosService, 
              private authService: AuthService,
              public turnosService:TurnosService) { }

  ngOnInit(): void {
    this.authService.actualUser$.subscribe((user) => {
      this.usuarioLogueado = user;
      this.flagAdmin = this.usuarioLogueado?.tipoUsuario == "Admin"
    });
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuariosService.getUsuarios()
      .subscribe(
        (usuarios: Usuario[]) => {
          // Filtrar usuarios según el valor de la especialidad
          this.usuarios = usuarios.filter((usuario: Usuario) =>  usuario.aceptado == "true");
          this.especialistas = usuarios.filter((usuario: Usuario) => usuario.especialidad != null && usuario.aceptado == "false");
        },
        (error) => {
          console.log('Error al obtener los usuarios:', error);
        }
      );
  }

  actualizarEstado(dni: string, flag: string,email:string|null,pass:string|null): void {
    if (email != null && pass !=null)
    {
      this.authService.registerWithoutLogin(email, pass,this.usuarioLogueado)
    }
    
    const dniParse = Number(dni);
    this.usuariosService.actualizarAceptadoPorDNI(dniParse, flag)
      .then(() => {
        swal.fire('Procesamiento exitoso!', (flag === 'true') ? 'El usuario fue aceptado correctamente' : 'El usuario fue rechazado correctamente', 'success');
      })
      .catch((error) => {
        console.error('Error al actualizar el estado:', error);
      });
  }
  
  public downloadAllUsers() {
    this.exportUsersToXls(this.usuarios, 'usuarios');
  }

  public exportUsersToXls(users: Usuario[], fileName: string) {
    const usersMapped = users.map((user) => {
      return {
        Email: `${user.email}`,
        Nombre: `${user.nombre}`,
        Apellido: `${user.apellido}`,
        Dni: `${user.dni}`,
        Edad: `${user.edad}`,
        TipoUsuario: `${user.tipoUsuario}`,
      };
    });

    const workSheet = XLSX.utils.json_to_sheet(usersMapped);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'usuarios');
    XLSX.writeFile(workBook, `${fileName}.xlsx`);
  }

  descargarDatos(usuario: Usuario) {
    if (usuario.tipoUsuario === "Paciente") {
      this.showSpinner = true;
  
      setTimeout(() => {
        this.obtenerHistorialClinico(usuario)
          .then(() => {
            this.showSpinner = false;
  
            const fileName = `${usuario.nombre}_${usuario.apellido}_historial_clinico`;
            const historialMapped = this.historialClinico.map((turno: any) => {
              return {
                Especialidad: turno.especialidad || '',
                EspecialistaDni: turno.especialistaDni || '',
                NombreDoctor: turno.nombreDoctor || '',
                ApellidoDoctor: turno.apellidoDoctor || '',
                Fecha: turno.fecha || '',
                Hora: turno.hora || '',
                Atendido: turno.atendido ? 'Sí' : 'No',
                CalificacionPaciente: turno.calificacionPaciente || '',
                Resenia: turno.resenia || '',
                ConfirmacionDoctor: turno.confirmacionDoctor || '',
                PacienteDni: turno.pacienteDni || '',
                NombrePaciente: turno.nombrePaciente || '',
                ApellidoPaciente: turno.apellidoPaciente || '',
                EdadPaciente: turno.edadPaciente || '',
                ObraSocialPaciente: turno.obraSocialPaciente || '',
                Altura: turno.atencionDoc?.altura || '',
                Peso: turno.atencionDoc?.peso || '',
                Presion: turno.atencionDoc?.presion || '',
                Temperatura: turno.atencionDoc?.temperatura || '',
                DatosDinamicos: turno.atencionDoc?.datosDinamicos
                  ? turno.atencionDoc?.datosDinamicos.map((item: any) => `${item.clave}: ${item.valor}`).join(', ')
                  : '',
              };
            });
  
            if (historialMapped.length > 0) {
              const workSheet = XLSX.utils.json_to_sheet(historialMapped);
              const workBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workBook, workSheet, 'historial_clinico');
              XLSX.writeFile(workBook, `${fileName}.xlsx`);
            } else {
              Swal.fire('Historial Clínico Vacío', 'El historial clínico del paciente está vacío.', 'info');
            }
          })
          .catch((error) => {
            this.showSpinner = false;
            console.error('Error al obtener historial clínico:', error);
            Swal.fire('Error', 'Hubo un error al obtener el historial clínico.', 'error');
          });
      }, 2000);
  
    } else {
      Swal.fire('Operación Rechazada', 'El usuario seleccionado debe ser paciente para poder descargar el historial clínico.', 'info');
    }
  }
  
  obtenerHistorialClinico(usuario: Usuario) {
    return new Promise<void>((resolve, reject) => {
      this.turnosService.getHistoriaFull()
        .subscribe(historial => {
          this.historialClinico = historial.filter(turno =>
            turno.apellidoPaciente == usuario.apellido &&
            turno.nombrePaciente == usuario.nombre
          );
          resolve();
        }, error => {
          reject(error);
        });
    });
  }

}

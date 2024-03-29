export interface Turno {
    especialidad?:string;
    especialistaDni?: string;
    nombreDoctor?:string;
    apellidoDoctor?:string;
    fecha?: string;
    hora?: string;
    atendido?:Boolean;
    calificacionPaciente?: string;
    resenia?: string;
    confirmacionDoctor?:string;
    pacienteDni?: string;
    nombrePaciente?:string;
    apellidoPaciente?: string;
    edadPaciente?: string;
    obraSocialPaciente?: string;
    atencionDoc?: {
      altura?: string;
      peso?: string;
      presion?:string;
      temperatura?:string;
      datosDinamicos?:{
        clave?: any;
        valor?:any;
      }
    }
  }
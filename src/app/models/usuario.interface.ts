export class Usuario{
    nombre:string;
    apellido:string;
    email:string;
    edad:string;
    dni:string;
    password:string;
    obraSocial:string;
    especialidad:string;
    aceptado:string;
    fotoPerfil1?:string;
    fotoPerfil2?:string;
    tipoUsuario:string;
    diasAtencion?: Array<string>;
    horariosAtencion?:Array<string>;
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaFormato'
})
export class HoraFormatoPipe implements PipeTransform {
  transform(hora: string): string {
    // Verifica si la hora está en el formato esperado
    if (/^\d{2}:\d{2}$/.test(hora)) {
      const [horas, minutos] = hora.split(':');
      const horaNum = parseInt(horas, 10);

      // Determina si es am o pm
      const amPm = horaNum >= 12 ? 'pm' : 'am';

      // Convierte la hora a formato de 12 horas
      const horaFormato12 = horaNum % 12 === 0 ? 12 : horaNum % 12;

      // Formatea la hora final
      return `${horaFormato12}:${minutos}${amPm}`;
    } else {
      // Devuelve la hora sin cambios si no está en el formato esperado
      return hora;
    }
  }
}
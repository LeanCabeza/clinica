import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoTurno'
})
export class EstadoTurnoPipe implements PipeTransform {
  transform(estadoTurno: any): string {
    switch (estadoTurno) {
      case 'Atendido':
        return '🧬 Atendido 🧬';
      case 'Aceptado':
        return '✅ Aceptado ✅';
      case 'Rechazado':
        return '❌ Rechazado ❌';
      case 'Pendiente Confirmacion':
        return '⌛ Pendiente Confirmacion ⌛';
      default:
        return estadoTurno;
    }
  }
}
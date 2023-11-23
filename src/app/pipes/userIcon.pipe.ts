import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userIcon'
})
export class UserIconPipe implements PipeTransform {
  transform(tipoUsuario: any)  {
    switch (tipoUsuario) {
      case 'Especialista':
        return '🩺';
      case 'Admin':
        return '👑';
      default:
        return '🟢';
    }
  }
}
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDefaultImage]',
})
export class DefaultImageDirective {
  constructor(private readonly image: ElementRef) {}

  @HostListener('error')
  onError(): void {
    this.image.nativeElement.src = '../../assets/images/default-image.png';
  }
}

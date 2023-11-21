import { trigger, state, style, animate, transition } from '@angular/animations';

export const animations = {
  scaleInCenter: trigger('scaleInCenter', [
    state('void', style({
      transform: 'scale(0)',
      opacity: 0
    })),
    state('*', style({
      transform: 'scale(1)',
      opacity: 1
    })),
    transition('void => *', animate('0.5s cubic-bezier(.25,.46,.45,.94)')),
  ]),
  rotateVertLeft: trigger('rotateVertLeft', [
    state('*', style({
      transform: 'rotateY(360deg)',
      transformOrigin: 'left'
    })),
    transition('void => *', animate('1s cubic-bezier(.25,.46,.45,.94)')),
  ]),
  bounceTop: trigger('bounceTop', [
    state('void', style({
      transform: 'translateY(-45px)',
      animationTimingFunction: 'ease-in',
      opacity: 1
    })),
    state('*', style({
      transform: 'translateY(0)',
      animationTimingFunction: 'ease-out',
      opacity: 1
    })),
    transition('void => *', animate('0.9s 0.5s')),
  ]),
  trackingInContract: trigger('trackingInContract', [
    state('void', style({
      letterSpacing: '1em',
      opacity: 0
    })),
    state('*', style({
      letterSpacing: 'normal',
      opacity: 1
    })),
    transition('void => *', animate('0.8s cubic-bezier(.215,.61,.355,1.000)')),
  ]),
};
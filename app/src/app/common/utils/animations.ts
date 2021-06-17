import { animate, state, style, transition, trigger } from '@angular/animations';

export const animations = {
    dialogAnimation: [
        trigger('dialogAnimation', [
            transition(':enter', [
                style({ transform: 'scale(0.9)', opacity: 0 }),
                animate('200ms 100ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
            ]),
            transition(':leave', [style({ opacity: 1 }), animate('200ms 0ms ease-in', style({ opacity: 0 }))])
        ])
    ],
    modalBgFadeIn: [
        trigger('modalBgFadeIn', [
            transition(':enter', [style({ opacity: 0 }), animate('200ms 0ms ease-out', style({ opacity: 0.4 }))]),
            transition(':leave', [style({ opacity: 0.4 }), animate('200ms 0ms ease-out', style({ opacity: 0 }))]),
        ])
    ],
    inOutAnimation: [
        trigger('inOutAnimation', [
            state('in', style({ opacity: 1 })),
            transition(':enter', [style({ opacity: '0' }), animate('.5s ease-out', style({ opacity: '1' }))]),
            transition(':leave', [style({ opacity: '1' }), animate('.5s ease-out', style({ opacity: '0' }))]),
        ])
    ],
    fadeIn: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('.5s ease-out', style({ opacity: '1' })),
            ]),
        ])
    ]
}
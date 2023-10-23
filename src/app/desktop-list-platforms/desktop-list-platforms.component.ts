import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { trigger, state, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-desktop-list-platforms',
  templateUrl: './desktop-list-platforms.component.html',
  styleUrls: ['./desktop-list-platforms.component.scss'],
  animations: [
    trigger('opacity', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('200ms', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: '0' }))
      ])
    ]),
    trigger('slideRight', [
      transition(':enter', [
        style({ transform: 'translateX(min(100%, 600px))' }),
        animate('200ms ease', style({ transform: '0px' })),
      ]),
      transition(':leave', [
        animate('200ms ease', style({ transform: 'translateX(min(100%, 600px))' }))
      ])
    ])
  ]
})
export class DesktopListPlatformsComponent implements OnInit {

  constructor() { }

  @Output() choose: EventEmitter<string> = new EventEmitter<string>()

  ngOnInit(): void {
  }

}

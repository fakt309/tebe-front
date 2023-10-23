import { Component, OnInit, HostBinding } from '@angular/core'
import { trigger, transition, style, animate, query } from '@angular/animations'

@Component({
  selector: 'app-desktop-select-location',
  templateUrl: './desktop-select-location.component.html',
  styleUrls: ['./desktop-select-location.component.scss'],
  animations: [
    trigger('slideTop', [
      transition(':enter', [
        style({ backgroundColor: '#00000000' }),
        query('.list', [
          style({ transform: 'translateY(-100px)', opacity: 0 })
        ]),
        animate('0.2s ease', style({ backgroundColor: '#00000022' })),
        query('.list', [
          animate('0.2s ease', style({ transform: 'translateY(0px)', opacity: 1 }))
        ])
      ]),
      transition(':leave', [
        query('.list', [
          animate('0.2s ease', style({ transform: 'translateY(-100px)', opacity: 0 }))
        ]),
        animate('0.2s ease', style({ backgroundColor: '#00000000' }))
      ])
    ])
  ]
})
export class DesktopSelectLocationComponent implements OnInit {

  @HostBinding('@slideTop') slideTop: string = 'show'

  constructor() { }

  ngOnInit(): void {
  }

}

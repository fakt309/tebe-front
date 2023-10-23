import { Component, OnInit, HostBinding } from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-touch-select-location',
  templateUrl: './touch-select-location.component.html',
  styleUrls: ['./touch-select-location.component.scss'],
  animations: [
    trigger('slideTop', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('0.5s ease', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('0.5s ease', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class TouchSelectLocationComponent implements OnInit {

  @HostBinding('@slideTop') slideTop: string = 'show'

  constructor() { }

  ngOnInit(): void {
  }

}

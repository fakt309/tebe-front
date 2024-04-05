import { Component, OnInit, HostBinding, Output, EventEmitter, ElementRef, ViewContainerRef } from '@angular/core'
import { trigger, transition, style, animate, query } from '@angular/animations'
import { Router } from '@angular/router'

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

  @Output() select: EventEmitter<string> = new EventEmitter<string>()

  @HostBinding('@slideTop') slideTop: string = 'show'

  constructor(
    public router: Router,
    public host: ElementRef,
    public viewContainerRef: ViewContainerRef
  ) { }

  setLang(lang: string): void {
    this.select.emit(lang)
  }

  ngOnInit(): void {
  }

}

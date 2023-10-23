import { Component, OnInit, AfterViewChecked, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { trigger, state, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-desktop-list-side',
  templateUrl: './desktop-list-side.component.html',
  styleUrls: ['./desktop-list-side.component.scss'],
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
export class DesktopListSideComponent implements OnInit, AfterViewChecked {

  @ViewChild('projection') projectionRef!: ElementRef

  optionsDOMs: Array<any> = []

  @Output() choose: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  checkChange(doms1: Array<any>, doms2: Array<any>): boolean {
    if (doms1.length !== doms2.length) return true

    for (let i = 0; i < doms1.length; i++) {
      if (doms1[i].outerHTML !== doms2[i].outerHTML) return true
    }

    return false
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    let options = this.projectionRef.nativeElement.querySelectorAll(':scope > *')
    if (this.checkChange(options, this.optionsDOMs)) this.optionsDOMs = options
  }

}

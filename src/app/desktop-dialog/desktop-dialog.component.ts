import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-desktop-dialog',
  templateUrl: './desktop-dialog.component.html',
  styleUrls: ['./desktop-dialog.component.scss'],
  animations: [
    trigger('opacity', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.2s ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.2s ease', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-40px)' }),
        animate('0.2s ease', style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease', style({ opacity: 0, transform: 'translateY(-40px)' }))
      ])
    ])
  ]
})
export class DesktopDialogComponent implements OnInit {

  @Output() close: EventEmitter<void> = new EventEmitter<void>()

  @ViewChild('displayRef') displayRef!: ElementRef

  @HostListener('click', ['$event']) onClick(e: any): void {
    if (!this.displayRef.nativeElement.contains(e.target)) this.close.emit()
  }

  constructor() { }

  ngOnInit(): void {
  }

}

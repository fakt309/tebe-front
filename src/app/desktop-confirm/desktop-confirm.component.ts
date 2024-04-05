import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, SimpleChanges, HostBinding } from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-desktop-confirm',
  templateUrl: './desktop-confirm.component.html',
  styleUrls: ['./desktop-confirm.component.scss'],
  animations: [
    trigger('slideTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-40px)' }),
        animate('200ms ease', style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        animate('200ms ease', style({ opacity: 0, transform: 'translateY(-40px)' }))
      ])
    ])
  ]
})
export class DesktopConfirmComponent implements OnInit {

  private first: boolean = true

  @Input() text: string = ''

  @Input() target!: HTMLElement

  @Output() result: EventEmitter<boolean> = new EventEmitter<boolean>()

  @HostBinding('@slideTop') slideTop: string = 'show'

  @HostBinding('style.left.px') left: number = 0
  @HostBinding('style.top.px') top: number = 0

  @HostListener('window:click', ['$event']) onClick(e: any): void {
    if (this.first) {
      this.first = false
      return
    }
    if (!this.host.nativeElement.contains(e.target)) this.result.emit(false)
  }

  @HostListener('window:resize') onResize(): void {
    this.setCoord()
  }

  constructor(
    private host: ElementRef,
    public locationService: LocationService
  ) { }

  setCoord(): void {
    let rectHost = this.host.nativeElement.getBoundingClientRect()
    let rect = this.target.getBoundingClientRect()
    if (!rect.x && !rect.y && !rect.width && !rect.height) return

    let x = rect.x+window.scrollX-40
    let y = rect.y+window.scrollY+30

    if (y+rectHost.height > window.innerHeight) y = rect.y-rectHost.height-30

    this.left = x
    this.top = y
  }

  ngOnInit(): void {
    this.setCoord()
  }

}

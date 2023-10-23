import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, HostListener } from '@angular/core'
import { Touch } from '../touch.service'

@Component({
  selector: 'app-desktop-sign-greetingcard',
  templateUrl: './desktop-sign-greetingcard.component.html',
  styleUrls: ['./desktop-sign-greetingcard.component.scss']
})
export class DesktopSignGreetingcardComponent implements OnInit {

  @Input() gift: any = {}
  @Input() tool: 'pen' | 'eraser' = 'pen'
  @Input() color: string = '#ffffff'
  @Input() sublimereset: boolean = false
  @Input() sublimesave: boolean = false

  @Output() close: EventEmitter<void> = new EventEmitter<void>()
  @Output() save: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()

  public under: any = { x: 0, y: 0, w: 0, h: 0 }
  public canvas: any = { x: 0, y: 0, w: 0, h: 0 }

  constructor() { }

  @HostListener('window:resize') onResize(): void {
    this.setSize()
  }

  setSize(): void {
    this.under.w = 0.4*window.innerWidth
    this.under.h = this.under.w/(297/420)
    this.under.x = this.under.w/2+(window.innerWidth-this.under.w)/2
    this.under.y = (window.innerHeight-this.under.h)/2+0.1*this.under.h
    this.canvas.w = this.under.w
    this.canvas.h = 0.2*this.under.h
    this.canvas.x = this.under.x-this.under.w/2
    this.canvas.y = this.under.y+this.under.h/2-this.canvas.h+1
  }

  ngOnInit(): void {
    this.setSize()
  }

  savedraw(points: Array<any>): void {
    this.save.emit(points)
  }

}

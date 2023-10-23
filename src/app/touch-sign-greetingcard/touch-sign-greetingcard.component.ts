import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, HostListener } from '@angular/core'
import { Touch } from '../touch.service'
import { GetTargetHtmlService } from '../services/get-target-html.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-sign-greetingcard',
  templateUrl: './touch-sign-greetingcard.component.html',
  styleUrls: ['./touch-sign-greetingcard.component.scss']
})
export class TouchSignGreetingcardComponent implements OnInit {

  @Input() gift: any = {}
  @Input() touch: Touch | null = null
  @Input() tool: 'pen' | 'eraser' = 'pen'
  @Input() color: string = '#fff'
  @Input() sublimereset: boolean = false
  @Input() sublimesave: boolean = false

  @Output() close: EventEmitter<void> = new EventEmitter<void>()
  @Output() save: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()

  public touchcanvas: Touch | null = null

  public under: any = { x: 0, y: 0, w: 0, h: 0 }
  public canvas: any = { x: 0, y: 0, w: 0, h: 0 }

  private flagdbltap: boolean = false
  private timeoutdbltap = setTimeout(() => {}, 0)

  private modemove: string = ''
  private startposunder = [0, 0]
  private startposcanvas = [0, 0]

  constructor(
    private gettargethtmlservice: GetTargetHtmlService,
    public locationService: LocationService
  ) { }

  setSize(): void {
    this.under.w = 0.9*window.innerWidth
    this.under.h = this.under.w/(297/420)
    this.under.x = this.under.w/2+(window.innerWidth-this.under.w)/2
    this.under.y = (window.innerHeight-this.under.h)/2+0.1*this.under.h
    this.canvas.w = this.under.w
    this.canvas.h = 0.2*this.under.h
    this.canvas.x = this.under.x-this.under.w/2
    this.canvas.y = this.under.y+this.under.h/2-this.canvas.h+1
  }

  processTouch(): void {
    if (this.touch === null) return

    if (this.touch!.action === 'start') {
      if (this.gettargethtmlservice.get(this.touch!.target as HTMLElement, 'canvas')) {
        this.modemove = 'canvas'
        this.touchcanvas = this.touch
      } else {
        this.startposunder = [this.under.x, this.under.y]
        this.startposcanvas = [this.canvas.x, this.canvas.y]
        this.modemove = 'shift'
      }
    }

    if (this.touch!.action === 'move') {
      if (this.modemove === 'canvas') {
        this.touchcanvas = this.touch
      } else if (this.modemove === 'shift') {
        this.canvas.x = this.startposcanvas[0]+this.touch!.x-this.touch!.start!.x
        this.canvas.y = this.startposcanvas[1]+this.touch!.y-this.touch!.start!.y
        this.under.x = this.startposunder[0]+this.touch!.x-this.touch!.start!.x
        this.under.y = this.startposunder[1]+this.touch!.y-this.touch!.start!.y
        if (this.under.x < -this.under.w/2) {
          this.under.x = -this.under.w/2
          this.canvas.x = this.under.x+(this.startposcanvas[0]-this.startposunder[0])
        }
        if (this.under.x > window.innerWidth+this.under.w/2) {
          this.under.x = window.innerWidth+this.under.w/2
          this.canvas.x = this.under.x+(this.startposcanvas[0]-this.startposunder[0])
        }
        if (this.under.y < -this.under.h/2) {
          this.under.y = -this.under.h/2
          this.canvas.y = this.under.y+(this.startposcanvas[1]-this.startposunder[1])
        }
        if (this.under.y > window.innerHeight+this.under.h/2) {
          this.under.y = window.innerHeight+this.under.h/2
          this.canvas.y = this.under.y+(this.startposcanvas[1]-this.startposunder[1])
        }
      }
    }

    if (this.touch!.action === 'end' && this.touch!.drag === false) {
      if (this.flagdbltap === true) {
        this.dbltap()
        this.flagdbltap = false
      } else {
        this.flagdbltap = true
        clearTimeout(this.timeoutdbltap)
        this.timeoutdbltap = setTimeout(() => {
          this.flagdbltap = false
        }, 200)
      }
    }

    if (this.touch!.action === 'end') {
      if (this.modemove === 'canvas') {
        this.touchcanvas = this.touch
      }
    }
  }

  dbltap(): void {
    this.close.emit()
  }

  ngOnInit(): void {
    this.setSize()
  }

  savedraw(points: Array<any>): void {
    this.save.emit(points)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.processTouch()
    }
  }

}

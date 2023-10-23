import { Component, OnInit, EventEmitter, Input, Output, SimpleChanges, ElementRef } from '@angular/core'
import { Touch2Service, Touch } from '../services/touch2.service'
import { GetTargetHtmlService } from '../services/get-target-html.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-sign-photo',
  templateUrl: './touch-sign-photo.component.html',
  styleUrls: ['./touch-sign-photo.component.scss']
})
export class TouchSignPhotoComponent implements OnInit {

  @Input() active: boolean = false
  @Input() tool: 'pen' | 'eraser' = 'pen'
  @Input() color: string = '#000000'
  @Input() gift: any = null
  @Input() sublimereset: boolean = false
  @Input() sublimesave: boolean = false
  @Output() close: EventEmitter<void> = new EventEmitter<void>()
  @Output() save: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()

  public touch: Touch | null = null

  public xcoord: number = 0
  public ycoord: number = 0
  public width: number = 0
  public height: number = 0

  private actionTouch: string = ''
  private obs!: any
  private memory: Array<number> = [0, 0]

  private dblflag: boolean = false
  private dbltimeout: any = setTimeout(() => {}, 0)

  constructor(
    private touch2Service: Touch2Service,
    private host: ElementRef,
    private getTargetHtmlService: GetTargetHtmlService,
    public locationService: LocationService
  ) { }

  setSize(): void {
    if (window.innerWidth/window.innerHeight > 48/64) {
      this.height = 0.9*window.innerHeight
      this.width = 0.9*window.innerHeight*(48/64)
    } else if (window.innerWidth/window.innerHeight <= 48/64) {
      this.width = 0.9*window.innerWidth
      this.height = 0.9*window.innerWidth/(48/64)
    }
    this.xcoord = (window.innerWidth-this.width)/2
    this.ycoord = (window.innerHeight-this.height)/2
  }

  processTouch(t: Touch): void {
    if (t.action === 'start') {
      let target = this.getTargetHtmlService.get(t.target, 'bright')
      if (target === null) {
        this.actionTouch = 'shift'
        this.memory = [this.xcoord, this.ycoord]
      } else {
        this.actionTouch = 'draw'
      }
    }

    if (t.action === 'start' || t.action === 'move') {
      if (this.actionTouch === 'shift' && t.action === 'move') {
        let x = this.memory[0]+(t.x-t.start!.x)
        let y = this.memory[1]+(t.y-t.start!.y)
        if (x < -this.width) x = -this.width
        if (x > window.innerWidth) x = window.innerWidth
        if (y < -this.height) y = -this.height
        if (y > window.innerHeight) y = window.innerHeight
        this.xcoord = x
        this.ycoord = y
      } else if (this.actionTouch === 'draw') {
        this.touch = t
      }
    }

    if (t.action === 'end') {
      if (!this.dblflag) {
        this.dblflag = true
        this.dbltimeout = setTimeout(() => { this.dblflag = false }, 200)
      } else if (this.dblflag) {
        this.dblflag = false
        this.dodbl()
      }
    }
  }

  dodbl(): void {
    this.close.emit()
  }

  savedraw(points: Array<any>): void {
    this.save.emit(points)
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && changes['active'].previousValue !== changes['active'].currentValue) {
      if (changes['active'].currentValue) {
        this.setSize()
        this.obs = this.touch2Service.listen(this.host.nativeElement).subscribe((t: Touch) => { this.processTouch(t) })
      } else if (!changes['active'].currentValue) {
        if (this.obs) this.obs.unsubscribe()
      }
    }
  }

}

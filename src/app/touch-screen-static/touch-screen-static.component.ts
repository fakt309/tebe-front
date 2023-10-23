import { Component, OnInit, OnChanges, Input, SimpleChanges, ElementRef, Output, EventEmitter } from '@angular/core'
import { Touch } from '../touch.service'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-screen-static',
  templateUrl: './touch-screen-static.component.html',
  styleUrls: ['./touch-screen-static.component.scss']
})
export class TouchScreenStaticComponent implements OnInit, OnChanges {

  @Input() touch: Touch | null = null
  @Input() show: boolean | null = null
  @Input() backable: boolean = true
  @Output() close: EventEmitter<void> = new EventEmitter<void>()

  translateX: number = 0

  canTranstlate: boolean = false

  animate: boolean = false

  touchRefresh: Touch | null = null

  velocity: number = 0

  timeoutVelocity: any = setTimeout(() => {}, 0)

  private stat = 'hide'

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService,
    public locationService: LocationService
  ) { }

  processTouch(): void {
    if (!this.touch) return

    if (this.touch!.action === 'move' && this.touch!.prev!.action === 'start') {
      if (Math.abs(this.touch!.x-this.touch!.prev!.x) > Math.abs(this.touch!.y-this.touch!.prev!.y) && this.touch!.x-this.touch!.prev!.x > 0 && this.backable) {
        this.canTranstlate = true
      }
    }

    if (this.touch!.action === 'move' && this.canTranstlate) {
      if (this.touch!.prev) this.velocity = this.touch!.x-this.touch!.prev!.x
      clearTimeout(this.timeoutVelocity)
      this.timeoutVelocity = setTimeout(() => { this.velocity = 0 }, 100)
      this.translateX = this.touch!.x-this.touch!.start!.x
      if (this.translateX < 0) this.translateX = 0
      if (this.translateX > window.innerWidth) this.translateX = window.innerWidth
    } else {
      this.touchRefresh = this.touch
    }

    if (this.touch!.action === 'end' && this.canTranstlate) {
      this.canTranstlate = false
      if (this.velocity > 0) {
        this.smoothClose()
      } else if (this.velocity < 0) {
        this.smoothShow()
      } else if (this.velocity == 0) {
        let x = this.touch!.x-this.touch!.start!.x
        if (x > window.innerWidth/2) {
          this.smoothClose()
        } else {
          this.smoothShow()
        }
      }
    }
  }

  async smoothShow(): Promise<void> {
    this.stat = 'show'
    this.animate = true
    this.host.nativeElement.style.display = 'block'
    await this.asyncService.delay(10)
    this.translateX = 0
    await this.asyncService.delay(200)
    this.animate = false
    return new Promise(res => res())
  }

  async smoothClose(): Promise<void> {
    this.stat = 'hide'
    this.animate = true
    await this.asyncService.delay(10)
    this.translateX = window.innerWidth
    await this.asyncService.delay(200)
    this.host.nativeElement.style.display = 'none'
    this.animate = false
    this.close.emit()
    return new Promise(res => res())
  }

  ngOnInit(): void {
    this.translateX = window.innerWidth
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].previousValue !== changes['show'].currentValue) {
      if (changes['show'].currentValue && this.stat === 'hide') {
        this.smoothShow()
      } else if (!changes['show'].currentValue && this.stat === 'show') {
        this.smoothClose()
      }
    }

    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.processTouch()
    }
  }

}

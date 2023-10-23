import { Component, OnInit, Input, ElementRef, SimpleChanges, Output, EventEmitter } from '@angular/core'
import { Touch } from '../touch.service'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-screen',
  templateUrl: './touch-screen.component.html',
  styleUrls: ['./touch-screen.component.scss']
})
export class TouchScreenComponent implements OnInit {

  @Input() touch: Touch | null = null
  @Input() show: boolean | null = null
  @Input() scrollable: boolean = true
  @Input() backable: boolean = true
  @Input() refreshable: boolean = false
  @Input() doscrolltocenter: boolean = false
  @Output() close: EventEmitter<void> = new EventEmitter<void>()

  public scroll: Touch | null = null
  private stat = 'hide'

  private disabled: any = {
    scroll: false,
    back: false
  }

  private velocity: number = 0
  private timeout: any = setTimeout(() => {}, 0)

  constructor(
    private asyncservice: AsyncService,
    private host: ElementRef,
    public locationService: LocationService
  ) { }

  processTouch(): void {
    if (!this.touch) return
    if (this.touch!.action === 'move' && this.touch!.prev!.action === 'start') {
      if (Math.abs(this.touch!.x-this.touch!.prev!.x) > Math.abs(this.touch!.y-this.touch!.prev!.y) && this.touch!.x-this.touch!.prev!.x > 0) {
        this.disabled.scroll = true
        this.disabled.back = false
      } else if (Math.abs(this.touch!.x-this.touch!.prev!.x) <= Math.abs(this.touch!.y-this.touch!.prev!.y)) {
        this.disabled.scroll = false
        this.disabled.back = true
      } else {
        this.disabled.scroll = true
        this.disabled.back = true
      }
    }

    if (!this.disabled.scroll && this.scrollable) this.scroll = this.touch!

    if (this.touch!.action === 'move' && !this.disabled.back && this.backable) {
      if (this.touch!.prev) this.velocity = this.touch!.x-this.touch!.prev!.x
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { this.velocity = 0 }, 100)
      let x = this.touch!.x-this.touch!.start!.x
      if (x < 0) x = 0
      if (x > window.innerWidth) x = window.innerWidth
      this.host.nativeElement.style.transform = `translateX(${x}px)`
    }

    if (this.touch!.action === 'end' && this.touch!.drag) {
      if (!this.disabled.back && this.backable) {
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
      this.disabled.scroll = false
      this.disabled.back = false
    }
  }

  async smoothShow(): Promise<void> {
    this.stat = 'show'
    this.host.nativeElement.style.transition = 'all ease 0.2s'
    this.host.nativeElement.style.display = 'flex'
    await this.asyncservice.delay(10)
    this.host.nativeElement.style.transform = 'translateX(0px)'
    await this.asyncservice.delay(200)
    this.host.nativeElement.style.removeProperty('transition')
    return new Promise(res => res())
  }

  async smoothClose(): Promise<void> {
    this.stat = 'hide'
    this.host.nativeElement.style.transition = 'all ease 0.2s'
    await this.asyncservice.delay(10)
    this.host.nativeElement.style.transform = 'translateX(100%)'
    await this.asyncservice.delay(200)
    this.host.nativeElement.style.display = 'none'
    this.host.nativeElement.style.removeProperty('transition')
    this.close.emit()
    return new Promise(res => res())
  }

  async showback(): Promise<void> {
    let back = this.host.nativeElement.querySelector(".back")
    let wraplist = this.host.nativeElement.querySelector(".wraplist")
    back.style.transition = 'all ease 0.2s'
    wraplist.style.transition = 'all ease 0.2s'
    await this.asyncservice.delay(10)
    back.style.transform = 'translateY(0px)'
    wraplist.style.height = 'calc(100% - 41px)'
    wraplist.style.marginTop = '41px'
    await this.asyncservice.delay(200)
    back.style.removeProperty('transition')
    wraplist.style.removeProperty('transition')
    return new Promise(res => res())
  }
  async hideback(): Promise<void> {
    let back = this.host.nativeElement.querySelector(".back")
    let wraplist = this.host.nativeElement.querySelector(".wraplist")
    back.style.transition = 'all ease 0.2s'
    wraplist.style.transition = 'all ease 0.2s'
    await this.asyncservice.delay(10)
    back.style.transform = 'translateY(-50px)'
    wraplist.style.height = '100%'
    wraplist.style.marginTop = '0'
    await this.asyncservice.delay(200)
    back.style.removeProperty('transition')
    wraplist.style.removeProperty('transition')
    return new Promise(res => res())
  }

  ngOnInit(): void {
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

    if (changes['scrollable'] && changes['scrollable'].previousValue !== changes['scrollable'].currentValue) {
      const list = this.host.nativeElement.querySelector(".wraplist > app-touch-scroll > .list") as HTMLElement
      if (changes['scrollable'].currentValue) {
        list.style.removeProperty('height')
      } else {
        list.style.height = '100%'
      }
    }

    if (changes['backable'] && changes['backable'].previousValue !== changes['backable'].currentValue) {
      if (changes['backable'].currentValue) {
        this.showback()
      } else {
        this.hideback()
      }
    }
  }

}

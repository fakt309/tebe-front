import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ElementRef, HostBinding, AfterViewInit, OnDestroy } from '@angular/core'
import { Touch } from '../touch.service'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'
import { trigger, transition, animate, style } from '@angular/animations'

@Component({
  selector: 'app-touch-scroll-fragments-refresh',
  templateUrl: './touch-scroll-fragments-refresh.component.html',
  styleUrls: ['./touch-scroll-fragments-refresh.component.scss']
})
export class TouchScrollFragmentsComponentRefresh implements OnInit, AfterViewInit, OnDestroy {

  @Input() touch: Touch | null = null
  @Input() show: boolean | null = null
  @Input() title: string = ''

  @Output() close: EventEmitter<void> = new EventEmitter<void>()

  @HostBinding('style.transform') transform: string = 'translateX(100%)'
  @HostBinding('style.transition') animate: string = 'none'

  touchRefresh: Touch | null = null

  private scroll: number = 0
  private velocity: number = 0
  private timeoutVelocity: any = setTimeout(() => {}, 0)

  private canScroll: boolean = false

  private doScrollBack: boolean = false

  public stat: string = 'hide'

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService,
    public locationService: LocationService
  ) { }

  setSize(): void {
    const host = this.host.nativeElement
    const hostRect = host.getBoundingClientRect()
    let children = host.querySelectorAll(".content > *")
    for (let child of children) {
      child.style.width = `${hostRect.width}px`
      child.style.height = `${hostRect.height}px`
      child.style.display = 'flex'
      child.style.flexDirection = 'column'
      child.style.alignItems = 'center'
      child.style.justifyContent = 'center'
    }
    this.doScrollByPosition(0, false)
  }

  async doScrollByPosition(pos: number, smooth: boolean): Promise<void> {
    const host = this.host.nativeElement
    const hostRect = host.getBoundingClientRect()
    const firstEl = host.querySelector(".content > *:first-child")
    if (smooth) {
      firstEl.style.transition = "margin-top ease 0.3s"
      await this.asyncService.delay(10)
      firstEl.style.marginTop = `${-pos*hostRect.height}px`
      await this.asyncService.delay(300)
      firstEl.style.removeProperty('transition')
    } else {
      firstEl.style.marginTop = `${-pos*hostRect.height}px`
    }
    this.scroll = -pos*hostRect.height

    // const length = host.querySelectorAll(".content > *").length-2
    // if (pos === -1) {
    //   this.doScrollByPosition(length-1, false)
    // } else if (pos === length) {
    //   this.doScrollByPosition(0, false)
    // }
    return new Promise(res => res())
  }

  doScrollByTouch(t: Touch): void {
    if (t !== null && t.action === 'move' && t.prev!.action === 'start') {
      if (Math.abs(t.x-t.prev!.x) > Math.abs(t.y-t.prev!.y)) {
        this.canScroll = false
        if (t.x-t.prev!.x > 0) {
          this.doScrollBack = true
        } else {
          this.doScrollBack = false
        }
      } else {
        this.canScroll = true
        this.doScrollBack = false
      }
    }

    if (t !== null && t.action === 'move' && !this.canScroll && this.doScrollBack) {
      if (this.touch!.prev) this.velocity = this.touch!.x-this.touch!.prev!.x
      clearTimeout(this.timeoutVelocity)
      this.timeoutVelocity = setTimeout(() => { this.velocity = 0 }, 100)
      let translateX = this.touch!.x-this.touch!.start!.x
      if (translateX < 0) translateX = 0
      if (translateX > window.innerWidth) translateX = window.innerWidth
      this.transform = `translateX(${translateX}px)`
    }

    if (t !== null && t.action === 'move' && this.canScroll) {
      const host = this.host.nativeElement
      const hostRect = host.getBoundingClientRect()
      const y = t.y-t.start!.y
      this.velocity = t.y-t.prev!.y
      this.timeoutVelocity = setTimeout(() => {
        this.velocity = 0
      }, 100)
      const length = host.querySelectorAll(".content > *").length
      let setScroll = this.scroll+y
      if (setScroll > 0) setScroll = 0
      if (setScroll < -1*(hostRect.height*(length-1))) setScroll = -1*(hostRect.height*(length-1))
      if (this.scroll+y > 0) this.touchRefresh = t
      this.host.nativeElement.querySelector(".content > *:first-child").style.marginTop = `${setScroll}px`
    }
    if (t !== null && t.action === 'end' && this.canScroll) {
      const host = this.host.nativeElement
      const hostRect = host.getBoundingClientRect()
      const y = t.y-t.start!.y
      this.scroll += y
      if (this.velocity === 0) {
        let pos = 0
        if (-this.scroll%hostRect.height > hostRect.height/2) {
          pos = Math.floor(-this.scroll/hostRect.height)
        } else {
          pos = Math.floor(-this.scroll/hostRect.height)-1
        }
        pos++
        const length = host.querySelectorAll(".content > *").length
        if (pos < 0) pos = 0
        if (pos > length-1) pos = length-1
        this.doScrollByPosition(pos, true)
      } else {
        let pos = 0
        if (this.velocity < 0) {
          pos = Math.floor(-this.scroll/hostRect.height)
        } else if (this.velocity > 0) {
          pos = Math.floor(-this.scroll/hostRect.height)-1
        }
        pos++
        const length = host.querySelectorAll(".content > *").length
        if (pos < 0) pos = 0
        if (pos > length-1) pos = length-1
        this.doScrollByPosition(pos, true)
      }
      this.touchRefresh = t
    }
    if (t !== null && t.action === 'end' && this.doScrollBack) {
      this.doScrollBack = false
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
    this.animate = 'ease 0.2s'
    this.host.nativeElement.style.display = 'block'
    await this.asyncService.delay(10)
    this.setSize()
    await this.asyncService.delay(10)
    this.transform = 'translateX(0px)'
    await this.asyncService.delay(200)
    this.animate = 'none'
    return new Promise(res => res())
  }

  async smoothClose(): Promise<void> {
    this.stat = 'hide'
    this.animate = 'ease 0.2s'
    await this.asyncService.delay(10)
    this.transform = `translateX(${window.innerWidth}px)`
    await this.asyncService.delay(200)
    this.host.nativeElement.style.display = 'none'
    this.animate = 'none'
    this.close.emit()
    return new Promise(res => res())
  }

  ngOnInit(): void {}

  async ngOnDestroy(): Promise<void> {
    await this.smoothClose()
    await this.asyncService.delay(3000)
    return new Promise(res => res())
  }

  ngAfterViewInit(): void {
    // this.setSize()

    // this.transform = `translateX(${window.innerWidth}px)`
    // setTimeout(() => {
    //   this.smoothShow()
    // }, 10)
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
      this.doScrollByTouch(changes['touch'].currentValue)
    }
  }

}

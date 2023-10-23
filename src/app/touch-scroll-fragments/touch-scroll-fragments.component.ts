import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ElementRef } from '@angular/core'
import { Touch } from '../touch.service'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-scroll-fragments',
  templateUrl: './touch-scroll-fragments.component.html',
  styleUrls: ['./touch-scroll-fragments.component.scss']
})
export class TouchScrollFragmentsComponent implements OnInit {

  @Input() touch: Touch | null = null
  @Input() sublimerefresh: boolean = false

  private scroll: number = 0
  private velocity: number = 0
  private timeoutVelocity: any = setTimeout(() => {}, 0)

  private canScroll: boolean = false

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService,
    public locationService: LocationService
  ) { }

  init(): void {
    const host = this.host.nativeElement
    const hostRect = host.getBoundingClientRect()
    let children = host.querySelectorAll(".content > *")
    host.querySelector(".content").prepend(children[children.length-1].cloneNode(true))
    host.querySelector(".content").appendChild(children[0].cloneNode(true))
  }

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
      firstEl.style.marginTop = `${-(pos+1)*hostRect.height}px`
      await this.asyncService.delay(300)
      firstEl.style.removeProperty('transition')
    } else {
      firstEl.style.marginTop = `${-(pos+1)*hostRect.height}px`
    }
    this.scroll = -(pos+1)*hostRect.height

    const length = host.querySelectorAll(".content > *").length-2
    if (pos === -1) {
      this.doScrollByPosition(length-1, false)
    } else if (pos === length) {
      this.doScrollByPosition(0, false)
    }
    return new Promise(res => res())
  }

  doScrollByTouch(t: Touch): void {
    if (t !== null && t.action === 'move' && t.prev!.action === 'start') {
      if (Math.abs(t.x-t.prev!.x) > Math.abs(t.y-t.prev!.y)) {
        this.canScroll = false
      } else {
        this.canScroll = true
      }
    }
    if (t !== null && t.action === 'move' && this.canScroll) {
      const y = t.y-t.start!.y
      this.velocity = t.y-t.prev!.y
      this.timeoutVelocity = setTimeout(() => {
        this.velocity = 0
      }, 100)
      this.host.nativeElement.querySelector(".content > *:first-child").style.marginTop = `${this.scroll+y}px`
    }
    if (t !== null && t.action === 'end' && this.canScroll) {
      const host = this.host.nativeElement
      const hostRect = host.getBoundingClientRect()
      const y = t.y-t.start!.y
      this.scroll += y
      if (this.velocity === 0) {
        if (-this.scroll%hostRect.height > hostRect.height/2) {
          this.doScrollByPosition(Math.floor(-this.scroll/hostRect.height), true)
        } else {
          this.doScrollByPosition(Math.floor(-this.scroll/hostRect.height)-1, true)
        }
      } else {
        if (this.velocity < 0) {
          this.doScrollByPosition(Math.floor(-this.scroll/hostRect.height), true)
        } else if (this.velocity > 0) {
          this.doScrollByPosition(Math.floor(-this.scroll/hostRect.height)-1, true)
        }
      }
    }
  }

  ngOnInit(): void {
    this.init()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.doScrollByTouch(changes['touch'].currentValue)
    }
    if (changes['sublimerefresh'] && changes['sublimerefresh'].previousValue !== changes['sublimerefresh'].currentValue && changes['sublimerefresh'].previousValue !== undefined) {
      this.setSize()
    }
  }

}

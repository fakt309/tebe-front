import { Component, OnInit, Input, SimpleChanges, ElementRef } from '@angular/core'
import { Touch } from '../touch.service'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-touch-scroll',
  templateUrl: './touch-scroll.component.html',
  styleUrls: ['./touch-scroll.component.scss']
})
export class TouchScrollComponent implements OnInit {

  @Input() touch: Touch | null = null
  @Input() disabled: boolean = false
  @Input() scrolltocenter: boolean | null = null
  @Input() refreshable: boolean = false

  public refresheight: number = 50
  public refreshTouch: Touch | null = null

  private static: number = 0
  private dynamic: number = 0
  private velocity: number = 0
  private timeout = setTimeout(() => {}, 0)
  private interrupt: boolean = false
  private positionatstart: string = 'topedge'
  private margin: number = 10
  private marginedges: number = 50

  constructor(
    private asyncservice: AsyncService,
    private host: ElementRef
  ) { }

  scroll(): void {
    if (this.touch!.action === 'start') {
      this.interrupt = true
      this.positionatstart = this.getposition
    } else if (this.touch!.action === 'move') {
      this.transformposition()
      this.interrupt = false
      this.dynamic = this.touch!.y-this.touch!.start!.y
      this.velocity = this.touch!.y-this.touch!.prev!.y
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.velocity = 0
      }, 100)
      this.checkmiddleedges()
    } else if (this.touch!.action === 'end') {
      this.static += this.dynamic
      this.dynamic = 0
      if (!this.checkedges() && !this.checkmiddleedges()) this.inertia(this.velocity)
    }

    if (this.refreshable && this.positionatstart === 'top') {
      const host: any = this.host.nativeElement.getBoundingClientRect()
      if ((this.touch!.action === 'move' && this.getscroll >= host.height-this.refresheight) || this.touch!.action === 'end') {
        this.refreshTouch = this.touch!
      } else {
        this.refreshTouch = null
      }
    }
  }

  async inertia(velocity: number): Promise<void> {
    if (velocity > 30) velocity = 30

    while (Math.abs(velocity) > 0.5) {
      if (this.interrupt) {
        this.static += this.dynamic
        this.dynamic = 0
        this.interrupt = false
        return
      }
      this.transformposition()
      await this.asyncservice.delay(1)
      this.static += velocity
      velocity = velocity*0.99
      if (this.checkedges()) this.interrupt = true
      if (this.checkmiddleedges()) this.interrupt = true
    }
  }

  get getposition(): string {
    const host: any = this.host.nativeElement.getBoundingClientRect()
    const list: any = this.host.nativeElement.querySelector(".list").getBoundingClientRect()
    if (list.y > host.y-this.margin && list.y < host.y+this.margin && list.y+list.height > host.y+host.height-this.margin && list.y+list.height < host.y+host.height+this.margin) {
      return 'idyll'
    } else if (list.y > host.y-this.margin && list.y < host.y+this.margin) {
      return 'topedge'
    }  else if (list.y+list.height > host.y+host.height-this.margin && list.y+list.height < host.y+host.height+this.margin) {
      return 'bottomedge'
    } else if (list.y > host.y && list.y+list.height > host.y+host.height) {
      return 'top'
    } else if (list.y < host.y && list.y+list.height < host.y+host.height) {
      return 'bottom'
    }
    return 'center'
  }

  transformposition(): void {
    const current: string = this.getposition
    if ((this.positionatstart === 'idyll' || this.positionatstart === 'topedge' || this.positionatstart === 'bottomedge') && current !== 'idyll' && current !== 'topedge' && current !== 'bottomedge') {
      this.positionatstart = current
    }
  }

  get getscroll(): number {
    return this.static+this.dynamic
  }

  async smoothgoto(to: number): Promise<void> {
    this.host.nativeElement.querySelector(".list").style.transition = "all ease 0.1s"
    await this.asyncservice.delay(10)
    this.static = to
    this.dynamic = 0
    await this.asyncservice.delay(100)
    this.host.nativeElement.querySelector(".list").style.transition = "none"
  }

  checkedges(): boolean {
    const host: any = this.host.nativeElement.getBoundingClientRect()
    const list: any = this.host.nativeElement.querySelector(".list").getBoundingClientRect()
    if (this.getscroll > host.height-this.marginedges) {
      this.smoothgoto(host.height-this.marginedges)
      return true
    } else if (this.getscroll+list.height < this.marginedges) {
      this.smoothgoto(-list.height+this.marginedges)
      return true
    }
    return false
  }

  checkmiddleedges(): boolean {
    const host: any = this.host.nativeElement.getBoundingClientRect()
    const list: any = this.host.nativeElement.querySelector(".list").getBoundingClientRect()
    if (list.height < host.height) {
      if (this.positionatstart == 'top') {
        if (this.getscroll < host.height-list.height+this.margin) {
          this.dynamic = host.height-list.height-this.static
          return true
        }
      } else if (this.positionatstart == 'bottom') {
        if (this.getscroll > -this.margin) {
          this.dynamic = -this.static
          return true
        }
      } else if (this.positionatstart == 'center') {
        if (this.getscroll < this.margin) {
          this.dynamic = -this.static
          return true
        } else if (this.getscroll+list.height > host.height-this.margin) {
          this.dynamic = host.height-list.height-this.static
          return true
        }
      }
    } else {
      if (this.positionatstart == 'top') {
        if (this.getscroll < this.margin) {
          this.dynamic = -this.static
          return true
        }
      } else if (this.positionatstart == 'bottom') {
        if (this.getscroll > -list.height+host.height-this.margin) {
          this.dynamic = -list.height+host.height-this.static
          return true
        }
      } else if (this.positionatstart == 'center') {
        if (this.getscroll > -this.margin) {
          this.dynamic = -this.static
          return true
        } else if (this.getscroll+list.height < host.height+this.margin) {
          this.dynamic = host.height-list.height-this.static
          return true
        }
      }
    }
    return false
  }

  doScrollToCenter(): void {
    const host: any = this.host.nativeElement.getBoundingClientRect()
    const list: any = this.host.nativeElement.querySelector(".list").getBoundingClientRect()

    if (list.height >= host.height) {
      this.static = 0
    } else {
      this.static = (host.height-list.height)/2
    }

    this.dynamic = 0
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue != changes['touch'].currentValue) {
      if (changes['touch'].currentValue === null) return
      this.scroll()
    } else if (changes['scrolltocenter'] && changes['scrolltocenter'].previousValue != changes['scrolltocenter'].currentValue) {
      this.doScrollToCenter()
    }
  }

}

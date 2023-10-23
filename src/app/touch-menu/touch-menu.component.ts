import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { Touch } from '../touch.service'
import { AsyncService } from '../async.service'
import { RandomColorService } from '../services/random-color.service'
import { GetTargetHtmlService } from '../services/get-target-html.service';

export interface OptionMenu {
  ico: string
  title: string
  value: string
}

@Component({
  selector: 'app-touch-menu',
  templateUrl: './touch-menu.component.html',
  styleUrls: ['./touch-menu.component.scss']
})
export class TouchMenuComponent implements OnInit {

  private xcoord: number = 0
  private stat: string = 'close'
  private velocity: number = 0
  private timeout = setTimeout(() => {}, 0)
  public touchlist: Touch | null = null
  @Input() options: Array<OptionMenu> = []
  @Input() touch: Touch | null = null
  @Input() sublimeshow: boolean = false
  @Output() action = new EventEmitter<string>()
  @HostBinding('style.transform') transform: string = `translateX(${this.xcoord}px)`
  private dirmove: string = 'horizontal'
  public doscrolltocenter: boolean = false
  public bindhandle: boolean = false
  public refreshhandle: boolean = false
  private hidden: boolean = true
  @Output() choose = new EventEmitter<string>()

  constructor(
    private host: ElementRef,
    private asyncservice: AsyncService,
    private randomcolor: RandomColorService,
    private gettargethtml: GetTargetHtmlService
  ) { }

  processTouch(): void {
    if (this.hidden) return
    if (this.touch === null) return

    if (this.touch!.action === 'end' && this.touch!.drag === false) {
      const option = this.gettargethtml.get(this.touch!.target as HTMLElement, 'option')
      if (option !== null) {
        const val: string = option.getAttribute('value') as string
        this.smoothclose().then(() => {
          this.choose.emit(val)
        })
      }
      return
    }

    if (this.touch!.action === 'move' && this.touch!.prev!.action === 'start') {
      if (Math.abs(this.touch!.x-this.touch!.prev!.x) > Math.abs(this.touch!.y-this.touch!.prev!.y)) {
        this.dirmove = 'horizontal'
      } else {
        this.dirmove = 'vertical'
      }
    }

    if (this.dirmove === 'horizontal' && this.touch!.action === 'move') {
      this.velocity = this.touch.x-this.touch.prev!.x
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => { this.velocity = 0 }, 100)

      if (this.stat == 'open') {
        this.xcoord = -window.innerWidth+this.touch!.x-this.touch!.start!.x
      } else if (this.stat == 'close') {
        this.xcoord = this.touch!.x-this.touch!.start!.x
      }

      if (this.xcoord > -20) this.xcoord = -20
      if (this.xcoord < -window.innerWidth) this.xcoord = -window.innerWidth

      this.setBackground()

      if (!this.bindhandle && this.velocity < 0) {
        this.bindhandle = true
      } else if (this.bindhandle && this.velocity > 0) {
        this.bindhandle = false
      }

      this.transform = `translateX(${(this.xcoord)}px)`
    } else if (this.dirmove === 'vertical' && this.stat === 'open') {
      this.touchlist = this.touch
    }

    if (this.touch.action == 'end') {
      if (this.dirmove == 'horizontal') {
        if (this.velocity == 0) {
          if (this.xcoord < -window.innerWidth/2) {
            this.smoothopen()
          } else {
            this.smoothclose()
          }
        } else if (this.velocity < 0) {
          this.smoothopen()
        }  else if (this.velocity > 0) {
          this.smoothclose()
        }

      }
    }
  }

  setBackground(): void {
    const background = this.host.nativeElement.querySelector(".back")
    if (this.xcoord === -20) {
      background.style.display = 'none'
    } else if (this.xcoord < -20) {
      background.style.display = 'flex'
    }

    background.style.opacity = `${this.xcoord/(-window.innerWidth+20)}`
    background.style.left = `${-window.innerWidth-this.xcoord}px`
  }

  async smoothopen(): Promise<void> {
    this.bindhandle = false
    this.action.emit('open')
    this.stat = 'open'
    this.host.nativeElement.style.transition = 'all ease 0.3s'
    this.host.nativeElement.querySelector(".back").style.display = 'flex'
    this.host.nativeElement.querySelector(".back").style.transition = 'all ease 0.3s'
    await this.asyncservice.delay(10)
    this.xcoord = -window.innerWidth
    this.transform = `translateX(${(this.xcoord)}px)`
    this.host.nativeElement.querySelector(".back").style.opacity = '1'
    this.host.nativeElement.querySelector(".back").style.left = `0px`
    await this.asyncservice.delay(300)
    this.host.nativeElement.style.transition = 'none'
    this.host.nativeElement.querySelector(".back").style.transition = 'none'
    return new Promise(res => res())
  }

  async smoothclose(): Promise<void> {
    this.bindhandle = false
    this.action.emit('close')
    this.stat = 'close'
    this.host.nativeElement.style.transition = 'all ease 0.3s'
    this.host.nativeElement.querySelector(".back").style.transition = 'all ease 0.3s'
    await this.asyncservice.delay(10)
    this.xcoord = -20
    this.transform = `translateX(${(this.xcoord)}px)`
    this.host.nativeElement.querySelector(".back").style.opacity = '0'
    this.host.nativeElement.querySelector(".back").style.left = `${-window.innerWidth+20}px`
    await this.asyncservice.delay(300)
    this.host.nativeElement.style.transition = 'none'
    this.host.nativeElement.querySelector(".back").style.transition = 'none'
    if (this.stat === 'close') this.host.nativeElement.querySelector(".back").style.display = 'none'
    this.doscrolltocenter = !this.doscrolltocenter
    return new Promise(res => res())
  }

  async show(): Promise<void> {
    this.host.nativeElement.style.transition = 'all ease 0.1s'
    await this.asyncservice.delay(10)
    this.hidden = false
    this.xcoord = -20
    this.transform = `translateX(${(this.xcoord)}px)`
    await this.asyncservice.delay(100)
    this.host.nativeElement.style.removeProperty('transition')
    return new Promise(res => res())
  }

  async hide(): Promise<void> {
    this.host.nativeElement.style.transition = 'all ease 0.1s'
    await this.asyncservice.delay(10)
    this.hidden = true
    this.xcoord = 0
    this.transform = `translateX(${(this.xcoord)}px)`
    await this.asyncservice.delay(100)
    this.host.nativeElement.style.removeProperty('transition')
    return new Promise(res => res())
  }

  ngOnInit(): void {
    // this.host.nativeElement.querySelector('.content').style.background = `linear-gradient(45deg, ${this.randomcolor.get()}, ${this.randomcolor.get()})`
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.processTouch()
    }
    if (changes['options'] && changes['options'].previousValue !== changes['options'].currentValue) {
      if (!changes['options'].currentValue[0] && !this.hidden) {
        this.hide()
      } else if (changes['options'].currentValue[0] && this.hidden) {
        this.show().then(() => {
          this.refreshhandle = !this.refreshhandle
          this.doscrolltocenter = !this.doscrolltocenter
        })
      } else {
        this.refreshhandle = !this.refreshhandle
        setTimeout(() => {
          this.doscrolltocenter = !this.doscrolltocenter
        }, 1);

      }
    }
    if (changes['sublimeshow'] && changes['sublimeshow'].previousValue !== changes['sublimeshow'].currentValue && changes['sublimeshow'].previousValue !== undefined) {
      this.smoothopen()
    }
  }

}

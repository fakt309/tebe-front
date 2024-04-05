import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { AsyncService } from '../async.service'
import { Touch } from '../touch.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-view-gift',
  templateUrl: './touch-view-gift.component.html',
  styleUrls: ['./touch-view-gift.component.scss']
})
export class TouchViewGiftComponent implements OnInit {

  public math = Math

  @Input() gift: any = null
  @Input() sublimerefresh: boolean = false
  @Input() buttomText: string = this.locationService.translate('change object parameters in the right sidebar', 'изменение параметров подарка в правом меню')

  public width: number = 0
  public height: number = 0

  private startrot: Array<number> = [0, 0]
  public rotateDisplayX: number = 0
  public rotateDisplayY: number = 0
  public intervalRotate: any = setInterval(() => {}, 10000)

  public giftsign: Array<any> = []

  @Input() mode: string = 'usual'
  @Input() touch: Touch | null = null

  constructor(
    private asyncservice: AsyncService,
    private host: ElementRef,
    public locationService: LocationService
  ) { }

  setsize(): void {
    if (this.gift === null) return

    let ratio = 0
    if (this.gift.type === 'greetingcard') {
      ratio = 297/420
    } else if (this.gift.type === 'game') {
      ratio = 135/190
    } else if (this.gift.type === 'speaker') {
      ratio = 299/136
    } else if (this.gift.type === 'tablet') {
      ratio = 247/178
    } else if (this.gift.type === 'photo') {
      ratio = 48/64
    }

    let w = 0
    let h = 0
    if (ratio >= window.innerWidth/window.innerHeight) {
      w = 0.8*window.innerWidth
      h = w/ratio
    } else if (ratio < window.innerWidth/window.innerHeight) {
      h = 0.8*window.innerHeight
      w = h*ratio
    }

    if (this.mode === 'usual') {
      w = 0.5*w
      h = 0.5*h
    }
    this.width = w
    this.height = h
  }

  async smoothsetusual(): Promise<void> {
    clearInterval(this.intervalRotate)
    // this.host.nativeElement.querySelector(".display").style.transition = "all ease 0.2s"
    await this.asyncservice.delay(10)
    // this.rotateDisplayY = 0
    this.host.nativeElement.querySelector('.hintview').style.top = '47%'
    if (this.host.nativeElement.querySelector('.hintsidebar')) this.host.nativeElement.querySelector('.hintsidebar').style.bottom = '0%'
    this.intervalRotate = setInterval(() => {
      this.rotateDisplayY++
      if (this.rotateDisplayY > 360) {
        this.rotateDisplayY = 0
      }
    }, 10)
    // await this.asyncservice.delay(200)
    // this.host.nativeElement.querySelector(".display").style.transition = "none"
    return new Promise(res => res())
  }
  async smoothsetreview(): Promise<void> {
    clearInterval(this.intervalRotate)
    // this.host.nativeElement.querySelector(".display").style.transition = "all ease 0.2s"
    await this.asyncservice.delay(10)
    // this.rotateDisplayY = 0
    this.host.nativeElement.querySelector('.hintview').style.top = '5%'
    if (this.host.nativeElement.querySelector('.hintsidebar')) this.host.nativeElement.querySelector('.hintsidebar').style.bottom = '-10%'
    await this.asyncservice.delay(200)
    // this.host.nativeElement.querySelector(".display").style.transition = "none"
    return new Promise(res => res())
  }

  rot(): void {
    if (this.touch === null || this.mode !== 'review') return
    if (this.touch.action === 'start') {
      this.startrot = [this.rotateDisplayX, this.rotateDisplayY]
    }
    if (this.touch.action === 'move') {
      this.rotateDisplayY = (this.startrot[1]+(this.touch.x-this.touch.start!.x))%360
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sublimerefresh'] && changes['sublimerefresh'].previousValue != changes['sublimerefresh'].currentValue && changes['sublimerefresh'].previousValue !== undefined) {
      if (this.gift.type === 'greetingcard' || this.gift.type === 'photo') {
        this.giftsign = this.gift.sign
      }
    }
    if (changes['gift'] && changes['gift'].previousValue != changes['gift'].currentValue) {
      this.setsize()
    }
    if (changes['mode'] && changes['mode'].previousValue != changes['mode'].currentValue) {
      if (changes['mode'].currentValue == 'usual') {
        this.smoothsetusual()
      } else if (changes['mode'].currentValue == 'review') {
        this.smoothsetreview()
      }

      this.setsize()
    }
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.rot()
    }
  }

}

import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { trigger, transition, style, animate } from '@angular/animations'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-touch-money-pack',
  templateUrl: './touch-money-pack.component.html',
  styleUrls: ['./touch-money-pack.component.scss']
})
export class TouchMoneyPackComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() value: number = 0
  @Input() show: boolean = false

  stat: 'hide' | 'show' = 'hide'

  objects: Array<any> = []

  typesObject: any = {
    money1: {
      name: 'money1',
      originWidth: 340,
      ratio: 340/246,
      src: '../../assets/pack-of-money/money1.png'
    },
    money2: {
      name: 'money2',
      originWidth: 357,
      ratio: 357/276,
      src: '../../assets/pack-of-money/money2.png'
    },
    money3: {
      name: 'money3',
      originWidth: 495,
      ratio: 495/142,
      src: '../../assets/pack-of-money/money3.png'
    },
    tape1: {
      name: 'tape1',
      originWidth: 167,
      ratio: 167/151,
      src: '../../assets/pack-of-money/tape1.png'
    },
    tape2: {
      name: 'tape2',
      originWidth: 212,
      ratio: 212/162,
      src: '../../assets/pack-of-money/tape2.png'
    },
    tape3: {
      name: 'tape3',
      originWidth: 123,
      ratio: 123/189,
      src: '../../assets/pack-of-money/tape3.png'
    }
  }

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService
  ) { }

  addObject(type: string, width: number = this.typesObject[type].originWidth, x: number = 0, y: number = 0, z: number = 0): void {
    const info = this.typesObject[type]
    this.objects.push({
      type,
      width,
      height: width/info.ratio,
      x,
      y,
      z
    })
  }

  getCount(): number {
    let count = 0
    if (this.value > 0 && this.value < 10) {
      count = 1
    } else if (this.value >= 10 && this.value < 50) {
      count = 2
    } else if (this.value >= 50 && this.value < 100) {
      count = 3
    } else if (this.value >= 100 && this.value < 700) {
      count = Math.floor(this.value/100)+3
    } else if (this.value >= 700) {
      count = Math.floor(this.value/1000)+10
    }
    if (count > 15) count = 15

    if (count >= 5 && count < 10) count++
    if (count >= 10 && count < 15) count += 2
    if (count === 15) count += 3

    return count
  }

  getInfo(index: number): { name: string, w: number, x: number, y: number } {
    const ww = window.innerWidth
    const wh = window.innerHeight

    if (index === 0) return { name: 'money1', w: 0.4*ww, x: -0.2*ww, y: 0.1*wh }
    if (index === 1) return { name: 'money1', w: 0.4*ww, x: -0.21*ww, y: 0.09*wh }
    if (index === 2) return { name: 'money1', w: 0.4*ww, x: -0.2*ww, y: 0.08*wh }
    if (index === 3) return { name: 'money1', w: 0.4*ww, x: -0.19*ww, y: 0.07*wh }
    if (index === 4) return { name: 'money1', w: 0.4*ww, x: -0.2*ww, y: 0.06*wh }
    if (index === 5) return { name: 'tape1', w: 0.25*ww, x: -0.19*ww, y: 0.063*wh }
    if (index === 6) return { name: 'money2', w: 0.38*ww, x: 0.2*ww, y: 0.1*wh }
    if (index === 7) return { name: 'money2', w: 0.38*ww, x: 0.21*ww, y: 0.09*wh }
    if (index === 8) return { name: 'money2', w: 0.38*ww, x: 0.2*ww, y: 0.08*wh }
    if (index === 9) return { name: 'money2', w: 0.38*ww, x: 0.19*ww, y: 0.07*wh }
    if (index === 10) return { name: 'money2', w: 0.38*ww, x: 0.2*ww, y: 0.06*wh }
    if (index === 11) return { name: 'tape2', w: 0.25*ww, x: 0.15*ww, y: 0.05*wh }
    if (index === 12) return { name: 'money3', w: 0.55*ww, x: 0*ww, y: 0.07*wh }
    if (index === 13) return { name: 'money3', w: 0.55*ww, x: 0.01*ww, y: 0.06*wh }
    if (index === 14) return { name: 'money3', w: 0.55*ww, x: 0*ww, y: 0.05*wh }
    if (index === 15) return { name: 'money3', w: 0.55*ww, x: -0.01*ww, y: 0.04*wh }
    if (index === 16) return { name: 'money3', w: 0.55*ww, x: 0*ww, y: 0.03*wh }
    if (index === 17) return { name: 'tape3', w: 0.16*ww, x: -0*ww, y: 0.05*wh }

    return { name: 'money1', w: 0.4*ww, x: -0.2*ww, y: 0.1*wh }
  }

  async refreshMoney(): Promise<void> {
    const count = this.getCount()

    if (count > this.objects.length) {
      for (let i = this.objects.length; i < count; i++) {
        const info = this.getInfo(i)
        this.addObject(info.name, info.w, info.x, info.y, i)
      }
    } else if (count < this.objects.length) {
      for (let i = this.objects.length-1; i > count; i--) {
        this.objects.splice(i, 1)
      }
    }

    if (this.objects.length <= 6) {
      this.objects.map((obj) => obj.x = 0)
    } else {
      this.objects.map((obj, idx) => idx < 6 ? obj.x = this.getInfo(idx).x : null)
    }

    return new Promise(res => res())
  }

  async smoothShow(): Promise<void> {
    this.stat = 'show'
    this.host.nativeElement.style.transition = 'all ease 0.2s'
    this.host.nativeElement.style.display = 'flex'
    await this.asyncService.delay(10)
    this.host.nativeElement.style.transform = 'translateY(0px)'
    this.host.nativeElement.style.opacity = '1'
    await this.asyncService.delay(200)
    this.host.nativeElement.style.removeProperty('transition')
    return new Promise(res => res())
  }

  async smoothClose(): Promise<void> {
    this.stat = 'hide'
    this.host.nativeElement.style.transition = 'all ease 0.2s'
    await this.asyncService.delay(10)
    this.host.nativeElement.style.transform = 'translateY(-100%)'
    this.host.nativeElement.style.opacity = '0'
    await this.asyncService.delay(200)
    this.host.nativeElement.style.display = 'none'
    this.host.nativeElement.style.removeProperty('transition')
    return new Promise(res => res())
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].previousValue !== changes['show'].currentValue) {
      if (changes['show'].currentValue && this.stat === 'hide') {
        this.smoothShow()
      } else if (!changes['show'].currentValue && this.stat === 'show') {
        this.smoothClose()
      }
    }

    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      this.refreshMoney()
    }
  }

  ngAfterViewInit(): void {


    // this.addObject('money1', 0.4*ww, -0.2*ww, 0.1*wh, 1)
    // this.addObject('money1', 0.4*ww, -0.21*ww, 0.09*wh, 2)
    // this.addObject('money1', 0.4*ww, -0.2*ww, 0.08*wh, 3)
    // this.addObject('money1', 0.4*ww, -0.19*ww, 0.07*wh, 4)
    // this.addObject('money1', 0.4*ww, -0.2*ww, 0.06*wh, 5)
    // this.addObject('tape1', 0.25*ww, -0.19*ww, 0.063*wh, 6)
    //
    // this.addObject('money2', 0.38*ww, 0.2*ww, 0.1*wh, 7)
    // this.addObject('money2', 0.38*ww, 0.21*ww, 0.09*wh, 8)
    // this.addObject('money2', 0.38*ww, 0.2*ww, 0.08*wh, 9)
    // this.addObject('money2', 0.38*ww, 0.19*ww, 0.07*wh, 10)
    // this.addObject('money2', 0.38*ww, 0.2*ww, 0.06*wh, 11)
    // this.addObject('tape2', 0.25*ww, 0.15*ww, 0.05*wh, 12)
    //
    // this.addObject('money3', 0.55*ww, 0*ww, 0.07*wh, 13)
    // this.addObject('money3', 0.55*ww, 0.01*ww, 0.06*wh, 14)
    // this.addObject('money3', 0.55*ww, 0*ww, 0.05*wh, 15)
    // this.addObject('money3', 0.55*ww, -0.01*ww, 0.04*wh, 16)
    // this.addObject('money3', 0.55*ww, 0*ww, 0.03*wh, 17)
    // this.addObject('tape3', 0.16*ww, -0*ww, 0.05*wh, 18)
  }

}

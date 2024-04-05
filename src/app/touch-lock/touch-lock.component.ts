import { Component, OnInit, OnDestroy, ElementRef, Input, HostBinding, Output, EventEmitter } from '@angular/core'
import { TouchService, Touch } from '../touch.service'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-touch-lock',
  templateUrl: './touch-lock.component.html',
  styleUrls: ['./touch-lock.component.scss']
})
export class TouchLockComponent implements OnInit {

  @Input() disabled: boolean = false

  @Input() toReject: EventEmitter<void> = new EventEmitter<void>()
  @Input() toAccept: EventEmitter<void> = new EventEmitter<void>()

  @Input() toInput: EventEmitter<void> = new EventEmitter<void>()

  @Output() input: EventEmitter<string> = new EventEmitter<string>()

  @HostBinding('style.animation-name') animationNameHost: string = ''

  subs: Array<Subscription> = []

  // code: string = '1000'

  opened: boolean = false

  alphabet: string = '0123456789'

  letterData: any = {
    size: 20
  }

  velocityTouch: number = 0
  timeoutVelocityTouch = setTimeout(() => {}, 0)

  activePosition: number = 0

  breakIntertia: boolean = false

  activeRect: any = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    shift: { x: 0, y: 0 },
    animated: false
  }

  positions: Array<number> = [5, 3, 4, 9]

  letters: Array<any> = [
    {
      value: 0,
      y: 0,
      shift: { y: 0 },
      animated: false
    }, {
      value: 0,
      y: 0,
      shift: { y: 0 },
      animated: false
    }, {
      value: 0,
      y: 0,
      shift: { y: 0 },
      animated: false
    }, {
      value: 0,
      y: 0,
      shift: { y: 0 },
      animated: false
    }
  ]

  modeMove: 'horizontal' | 'vertical' = 'horizontal'

  firstMove: boolean = true

  constructor(
    private host: ElementRef,
    private touchService: TouchService,
    private asyncService: AsyncService
  ) { }

  processTouch(t: Touch): void {
    if (this.disabled) return

    if (t.action === 'start') {
      this.breakIntertia = true
    } else if (t.action === 'move' && this.firstMove) {
      this.firstMove = false
      if (Math.abs(t.y-t.prev!.y) > Math.abs(t.x-t.prev!.x)) {
        this.modeMove = 'vertical'
      } else {
        this.modeMove = 'horizontal'
        this.activeRect.animated = false
      }
    } else if (t.action === 'move' && !this.firstMove) {
      
      if (this.modeMove === 'horizontal') {
        this.activeRect.shift.x = t.x-t.start!.x

        const min = -3/2*this.letterData.size
        const max = 3/2*this.letterData.size

        if (this.activeRect.x+this.activeRect.shift.x < min) {
          this.activeRect.shift.x = min-this.activeRect.x
        } else if (this.activeRect.x+this.activeRect.shift.x > max) {
          this.activeRect.shift.x = max-this.activeRect.x
        }
      } else if (this.modeMove === 'vertical') {
        this.letters[this.activePosition].animated = false

        this.velocityTouch = t.prev!.y-t.y
        clearTimeout(this.timeoutVelocityTouch)
        this.timeoutVelocityTouch = setTimeout(() => {
          this.velocityTouch = 0
        }, 200)

        this.letters[this.activePosition].shift.y = t.y-t.start!.y

        const min = -this.letterData.size*(this.alphabet.length*3-2.5)
        const max = -0.5*this.letterData.size

        if (this.letters[this.activePosition].y+this.letters[this.activePosition].shift.y < min) {
          this.letters[this.activePosition].shift.y = min-this.letters[this.activePosition].y
        } else if (this.letters[this.activePosition].y+this.letters[this.activePosition].shift.y > max) {
          this.letters[this.activePosition].shift.y = max-this.letters[this.activePosition].y
        }
      }

    } else if (t.action === 'end' && !this.opened) {
      this.firstMove = true

      // if (!t.drag) this.checkCode()

      if (this.modeMove === 'horizontal') {
        this.activeRect.x += this.activeRect.shift.x
        this.activeRect.shift.x = 0

        this.activeRect.animated = true

        this.activePosition = this.getClosePosition(this.activeRect.x)
        this.setActiveRect()
      } else if (this.modeMove === 'vertical') {
        this.breakIntertia = false

        this.letters[this.activePosition].y += this.letters[this.activePosition].shift.y
        this.letters[this.activePosition].shift.y = 0

        this.correctLetter(this.activePosition)

        this.inertiaLetter(this.activePosition, this.velocityTouch)
      }
    }
  }

  async inertiaLetter(index: number, velocity: number): Promise<void> {

    let sign = Math.round(velocity/Math.abs(velocity))
    let v = Math.abs(velocity)

    let min = 1
    let mu = 0.97

    this.correctLetter(index)

    while (v > min) {
      if (this.breakIntertia) break
      this.correctLetter(index)
      v = v*mu
      this.letters[index].y += -sign*v
      await this.asyncService.delay(10)
    }

    this.setClosestPositionVertical(index)

    return new Promise(res => res())
  }

  setClosestPositionVertical(indexLetter: number): void {
    let min = 999999
    let index = 0

    for (let i = 0; i < 10; i++) {
      let pos = -this.letterData.size*(this.alphabet.length+i-0.5)

      // console.log(i, pos, this.letters[indexLetter].y)

      if (Math.abs(this.letters[indexLetter].y-pos) < min) {
        min = Math.abs(this.letters[indexLetter].y-pos)
        index = i
      }
    }

    // console.log(index)

    this.setPositionByValueVertical(indexLetter, index, true)

  }

  async setPositionByValueVertical(index: number, value: number, animated: boolean = false): Promise<void> {
    this.correctLetter(index)
    await this.asyncService.delay(10)

    this.letters[index].animated = animated

    await this.asyncService.delay(10)

    this.letters[index].y = -this.letterData.size*(this.alphabet.length+value-0.5)

    this.letters[index].value = value

    await this.asyncService.delay(300)

    this.letters[index].animated = false
  }

  initLetter(): void {
    for (let i = 0; i < this.letters.length; i++) {
      this.setPositionByValueVertical(i, 0)
    }
  }

  async checkCode(): Promise<void> {
    let code = ''
    this.letters.forEach((x: any) => code += `${x.value}`)

    this.input.emit(code)

    // if (code === this.code) {
    //   this.result.emit(true)
    //   this.opened = true
    // } else {
    //   this.result.emit(false)
    //   this.animationNameHost = 'reject'
    //   await this.asyncService.delay(300)
    //   this.animationNameHost = ''
    // }

    return new Promise(res => res())
  }

  correctLetter(index: number): void {
    // const min = -this.letterData.size*(this.alphabet.length*3-2.5)
    // const max = -0.5*this.letterData.size
    // if (this.letters[index].y < min) {
    //   this.letters[index].y = min
    // } else if (this.letters[index].y > max) {
    //   this.letters[index].y = max
    // }

    if (this.letters[index].y > -this.letterData.size*(this.alphabet.length-1)) {
      this.letters[index].y -= this.letterData.size*(this.alphabet.length-0)
    } else if (this.letters[index].y < -this.letterData.size*(2*this.alphabet.length-1)) {
      this.letters[index].y += this.letterData.size*(this.alphabet.length-0)
    }
  }

  getClosePosition(x: number): number {
    let index = 0
    const start = -3/2*this.letterData.size
    const step = this.letterData.size
    let min = 9999999

    for (let i = 0; i < 4; i++) {
      let current = start+step*i
      if (Math.abs(x-current) < min) {
        index = i
        min = Math.abs(x-current)
      }
    }

    return index
  }

  getArrayAlphabet(): Array<string> {
    return this.alphabet.split('')
  }

  setSizeLetter(): void {
    const rect = this.host.nativeElement.getBoundingClientRect()

    this.letterData.size = rect.height*0.35

    this.setActiveRect()
  }

  setActiveRect(): void {
    const rect = this.host.nativeElement.getBoundingClientRect()

    this.activeRect.w = this.letterData.size
    this.activeRect.h = rect.height

    this.activeRect.x = -3/2*this.letterData.size+this.activePosition*this.letterData.size
    this.activeRect.y = 0
  }

  async animateReject(): Promise<void> {
    this.animationNameHost = 'reject'
    await this.asyncService.delay(300)
    this.animationNameHost = ''

    return new Promise(res => res())
  }

  async animateAccept(): Promise<void> {
    this.opened = true
      
    return new Promise(res => res())
  }

  ngOnInit(): void {

    this.initLetter()

    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )

    this.setSizeLetter()

    this.subs.push(
      this.toReject.subscribe(() => {
        this.animateReject()
      })
    )

    this.subs.push(
      this.toAccept.subscribe(() => {
        this.animateAccept()
      })
    )

    this.subs.push(
      this.toInput.subscribe(() => {
        this.checkCode()
      })
    )

  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

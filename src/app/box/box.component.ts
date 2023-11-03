import { Component, OnInit, Input, HostBinding, SimpleChanges } from '@angular/core'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss']
})
export class BoxComponent implements OnInit {

  constructor(
    private asyncService: AsyncService
  ) { }

  math: any = Math

  @HostBinding('class.animate') animateClass: boolean = false
  @HostBinding('class.shadow') shadow: boolean = false

  @Input('w') width: number = 300
  @Input('h') height: number = 200
  @Input('d') depth: number = 400
  @Input('inside') inside: string = ''
  @Input('package') package: string = '../../assets/box/package/1.jpg'
  @Input('tape') tape: string = '../../assets/box/tape/1.jpg'

  @Input('animate') animate: boolean = false
  @Input('packed') packed: boolean = false
  @Input('wrapped') wrapped: boolean = false
  @Input('tapped') tapped: boolean = false

  margin: number = 1
  widthTape: number = 20

  sides: Array<string> = ['', '', '', '', '', '']

  color: string = "#c3aa83"

  unbox: boolean = true

  bind1: boolean = false
  bind2: boolean = false

  wrapbind1: boolean = false
  wrapbind2: boolean = false
  wrapbind3: boolean = false

  tapebind1: boolean = false

  showPackage: boolean = false
  displayPackage: string = 'none'

  tapeshow: boolean = false
  tapedisplay: string = 'none'

  bowshow: boolean = false
  bowdisplay: string = 'none'

  async setInside(): Promise<void> {
    if (this.inside == '') {
      this.sides = ['', '', '', '', '', '']
      return
    }
    if (!/^data:image\/png\;base64\,/g.test(this.inside)) return

    let w = 0, h = 0
    let img = await this.asyncService.loadImg(this.inside)
    const cnvs = document.createElement('canvas')
    const ctx = cnvs.getContext('2d')

    w = this.height, h = this.depth
    cnvs.setAttribute('width', w+'px')
    cnvs.setAttribute('height', h+'px')
    ctx!.drawImage(img, 0, this.height, w, h, 0, 0, w, h)
    this.sides[0] = cnvs.toDataURL("image/png")

    w = this.width, h = this.height
    cnvs.setAttribute('width', w+'px')
    cnvs.setAttribute('height', h+'px')
    ctx!.drawImage(img, this.height, 0, w, h, 0, 0, w, h)
    this.sides[1] = cnvs.toDataURL("image/png")

    w = this.width, h = this.depth
    cnvs.setAttribute('width', w+'px')
    cnvs.setAttribute('height', h+'px')
    ctx!.drawImage(img, this.height, this.height, w, h, 0, 0, w, h)
    this.sides[2] = cnvs.toDataURL("image/png")

    w = this.width, h = this.height
    cnvs.setAttribute('width', w+'px')
    cnvs.setAttribute('height', h+'px')
    ctx!.drawImage(img, this.height, this.height+this.depth, w, h, 0, 0, w, h)
    this.sides[3] = cnvs.toDataURL("image/png")

    w = this.height, h = this.depth
    cnvs.setAttribute('width', w+'px')
    cnvs.setAttribute('height', h+'px')
    ctx!.drawImage(img, this.height+this.width, this.height, w, h, 0, 0, w, h)
    this.sides[4] = cnvs.toDataURL("image/png")

    w = this.width, h = this.depth
    cnvs.setAttribute('width', w+'px')
    cnvs.setAttribute('height', h+'px')
    ctx!.drawImage(img, this.height+this.width+this.height, this.height, w, h, 0, 0, w, h)
    this.sides[5] = cnvs.toDataURL("image/png")
  }

  async doPackedAnim(): Promise<void> {
    await this.asyncService.delay(10)
    this.bind1 = true
    await this.asyncService.delay(300)
    this.bind1 = false
    this.bind2 = true
    await this.asyncService.delay(300)
    this.unbox = false
    await this.asyncService.delay(300)
    return new Promise(res => res())
  }
  async doUnpackedAnim(): Promise<void> {
    await this.asyncService.delay(10)
    this.unbox = true
    await this.asyncService.delay(300)
    this.bind2 = false
    await this.asyncService.delay(300)
    return new Promise(res => res())
  }
  doPackedNoAnim(): void {
    this.bind1 = false
    this.bind2 = true
    this.unbox = false
  }
  doUnpackedNoAnim(): void {
    this.bind1 = false
    this.bind2 = false
    this.unbox = true
  }

  async doWrappedAnim(): Promise<void> {
    this.displayPackage = 'flex'
    await this.asyncService.delay(10)
    this.showPackage = true
    await this.asyncService.delay(1000)
    this.wrapbind1 = true
    await this.asyncService.delay(3000)
    this.wrapbind2 = true
    await this.asyncService.delay(500)
    this.wrapbind3 = true
    this.shadow = true
    await this.asyncService.delay(500)
    return new Promise(res => res())
  }
  async doUnwrappedAnim(): Promise<void> {
    await this.asyncService.delay(10)
    this.wrapbind3 = false
    this.shadow = false
    await this.asyncService.delay(500)
    this.wrapbind2 = false
    await this.asyncService.delay(500)
    this.wrapbind1 = false
    await this.asyncService.delay(3000)
    this.showPackage = false
    await this.asyncService.delay(1000)
    this.displayPackage = 'none'
    return new Promise(res => res())
  }
  doWrappedNoAnim(): void {
    this.displayPackage = 'flex'
    this.showPackage = true
    this.wrapbind1 = true
    this.wrapbind2 = true
    this.wrapbind3 = true
    this.shadow = true
  }
  doUnwrappedNoAnim(): void {
    this.displayPackage = 'none'
    this.showPackage = false
    this.wrapbind1 = false
    this.wrapbind2 = false
    this.wrapbind3 = false
    this.shadow = false
  }

  async doTappedAnim(): Promise<void> {
    this.tapedisplay = 'flex'
    this.bowdisplay = 'flex'
    await this.asyncService.delay(10)
    this.tapeshow = true
    await this.asyncService.delay(2000)
    this.tapebind1 = true
    await this.asyncService.delay(2000)
    this.bowshow = true
    await this.asyncService.delay(2000)
    return new Promise(res => res())
  }
  async doUntappedAnim(): Promise<void> {
    await this.asyncService.delay(10)
    this.bowshow = false
    await this.asyncService.delay(2000)
    this.tapebind1 = false
    await this.asyncService.delay(2000)
    this.tapeshow = false
    await this.asyncService.delay(2000)
    this.tapedisplay = 'none'
    this.bowdisplay = 'none'
    return new Promise(res => res())
  }
  doTappedNoAnim(): void {
    this.tapedisplay = 'flex'
    this.bowdisplay = 'flex'
    this.tapeshow = true
    this.tapebind1 = true
    this.bowshow = true
  }
  doUntappedNoAnim(): void {
    this.tapedisplay = 'none'
    this.bowdisplay = 'none'
    this.tapeshow = false
    this.tapebind1 = false
    this.bowshow = false
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animate'] && changes['animate'].previousValue != changes['animate'].currentValue) {
      this.animateClass = this.animate
    }

    if (changes['inside'] && changes['inside'].previousValue != changes['inside'].currentValue) {
      this.setInside()
    }

    if (changes['packed'] && changes['packed'].previousValue != changes['packed'].currentValue) {
      if (changes['packed'].currentValue) {
        if (this.animate) {
          this.doPackedAnim()
        } else {
          this.doPackedNoAnim()
        }
      } else {
        if (this.animate) {
          this.doUnpackedAnim()
        } else {
          this.doUnpackedNoAnim()
        }
      }
    }

    if (changes['wrapped'] && changes['wrapped'].previousValue != changes['wrapped'].currentValue) {
      if (changes['wrapped'].currentValue) {
        if (this.animate) {
          this.doWrappedAnim()
        } else {
          this.doWrappedNoAnim()
        }
      } else {
        if (this.animate) {
          this.doUnwrappedAnim()
        } else {
          this.doUnwrappedNoAnim()
        }
      }
    }

    if (changes['tapped'] && changes['tapped'].previousValue != changes['tapped'].currentValue) {
      if (changes['tapped'].currentValue) {
        if (this.animate) {
          this.doTappedAnim()
        } else {
          this.doTappedNoAnim()
        }
      } else {
        if (this.animate) {
          this.doUntappedAnim()
        } else {
          this.doUntappedNoAnim()
        }
      }
    }
  }

}
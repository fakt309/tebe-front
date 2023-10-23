import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-speaker',
  templateUrl: './speaker.component.html',
  styleUrls: ['./speaker.component.scss']
})
export class SpeakerComponent implements OnInit {

  @Input() size: number = 300
  @Input() color: string = "#ff5722"

  @Input() @HostBinding('class.smooth') smooth: boolean = false
  @Input() grill: string = '../../assets/speaker/grill/0.png'

  @Input() timer: number | string | null = null
  @Input() button: string = 'none'

  private ratio: number = 299/136

  public math = Math

  public width: number = this.size
  public height: number = this.size/this.ratio
  public depth: number = this.size/this.ratio

  public heightSide: number = (this.height/2)*Math.sin(36*(2*Math.PI/360))/Math.sin(72*(2*Math.PI/360))

  constructor(
    private asyncservice: AsyncService,
    private host: ElementRef
  ) { }

  setSize(): void {
    this.width = this.size
    this.height = this.size/this.ratio
    this.depth = this.size/this.ratio
    this.heightSide = (this.height/2)*Math.sin(36*(2*Math.PI/360))/Math.sin(72*(2*Math.PI/360))
  }

  animatePlay(flag: boolean) {
    const animate = this.host.nativeElement.querySelector(".button.play > svg > polygon:nth-child(1) > animate:nth-child(1)")
    if (flag) {
      animate.beginElement()
    } else {
      animate.endElement()
    }
  }

  animatePause(flag: boolean) {
    const animate1 = this.host.nativeElement.querySelector(".button.pause > svg > polygon:nth-child(1) > animate:nth-child(1)")
    const animate2 = this.host.nativeElement.querySelector(".button.pause > svg > polygon:nth-child(2) > animate:nth-child(1)")
    if (flag) {
      animate1.beginElement()
      animate2.beginElement()
    } else {
      animate1.endElement()
      animate2.endElement()
    }
  }

  animatePrev() {
    const animate1 = this.host.nativeElement.querySelector(".button.prev > svg > polygon:nth-child(1) > animate:nth-child(1)")
    const animate2 = this.host.nativeElement.querySelector(".button.prev > svg > polygon:nth-child(2) > animate:nth-child(1)")
    animate1.beginElement()
    animate2.beginElement()
  }

  animateNext() {
    const animate1 = this.host.nativeElement.querySelector(".button.next > svg > polygon:nth-child(1) > animate:nth-child(1)")
    const animate2 = this.host.nativeElement.querySelector(".button.next > svg > polygon:nth-child(2) > animate:nth-child(1)")
    animate1.beginElement()
    animate2.beginElement()
  }

  // async setSizeSmooth(from: number, to: number): Promise<void> {
  //   const memory = this.smooth
  //   this.smooth = false
  //   const steps = 20
  //   this.size = from
  //   for (let i = 0; i < steps; i++) {
  //     await this.asyncservice.delay(1)
  //     this.size += (to-from)/steps
  //     this.setSize()
  //   }
  //   this.smooth = memory
  //   return new Promise(res => res())
  // }

  // async setSizeSmooth(from: number, to: number): Promise<void> {
  //   const memory = this.smooth
  //   this.smooth = false
  //   await this.asyncservice.delay(10)
  //   this.size = to
  //   this.setSize()
  //   this.host.nativeElement.style.transform = `scale(${from/to}) rotateX(0deg) rotateY(180deg)`
  //   this.depth = from/this.ratio
  //   // await this.asyncservice.delay(10)
  //   // this.smooth = true
  //   // await this.asyncservice.delay(10)
  //   // this.host.nativeElement.style.transform = `scale(1)`
  //   // this.depth = to/this.ratio
  //
  //   await this.asyncservice.delay(300)
  //   this.smooth = memory
  //   return new Promise(res => res())
  // }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size'] && changes['size'].previousValue !== changes['size'].currentValue) {
      this.setSize()
      // if (this.smooth && changes['size'].previousValue) {
      //   this.setSizeSmooth(changes['size'].previousValue, changes['size'].currentValue)
      // } else {
      //   this.setSize()
      // }
    }
    if (changes['button'] && changes['button'].previousValue !== changes['button'].currentValue) {
      if (changes['button'].currentValue === 'play') {
        this.animatePlay(true)
        this.animatePause(false)
      } else if (changes['button'].currentValue === 'pause') {
        this.animatePlay(false)
        this.animatePause(true)
      } else if (changes['button'].currentValue === 'prev') {
        this.animatePrev()
      } else if (changes['button'].currentValue === 'next') {
        this.animateNext()
      } else if (changes['button'].currentValue === 'none') {
        this.animatePlay(false)
        this.animatePause(false)
      }
    }
  }

}

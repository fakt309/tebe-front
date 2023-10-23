import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { LinerSvgService } from '../services/liner-svg.service'

@Component({
  selector: 'app-greeting-card',
  templateUrl: './greeting-card.component.html',
  styleUrls: ['./greeting-card.component.scss']
})
export class GreetingCardComponent implements OnInit {

  private ratio1: number = 297/420
  private ratio2: number = 297/1
  private width: number = 100
  private height: number = 100/this.ratio1
  private depth: number = 100/this.ratio2
  private font: number = 20

  @Input() size: number = 100
  @Input() front: string = '../../assets/greetingcard/front/1.png'
  @Input() back: string = '../../assets/greetingcard/back/1.jpg'
  @Input() text: string = ''
  @Input() sign: Array<any> = []
  @Input() color: string = '#000'

  @Input() @HostBinding('class.smooth') smooth: boolean = false

  constructor(
    private linerSvgService: LinerSvgService,
    private host: ElementRef
  ) { }

  get getWidth(): number {
    return this.width
  }
  get getHeight(): number {
    return this.height
  }
  get getDepth(): number {
    return this.depth
  }
  get getFont(): number {
    return this.font
  }
  set setWidth(w: number) {
    this.width = w
  }
  set setHeight(h: number) {
    this.height = h
  }
  set setDepth(d: number) {
    this.depth = d
  }
  set setFont(d: number) {
    this.font = d
  }

  setSize(size: number): void {
    this.setWidth = size
    this.setHeight = size/this.ratio1
    this.setDepth = size/this.ratio2
    this.font = 0.06*this.getWidth
    setTimeout(() => {
      this.setSign()
    }, 10)
  }

  setSign(): void {
    // let svg = this.linerSvgService.getSvg(1000, 0.2*(1000/(297/420)), this.sign)
    let svg = this.linerSvgService.getSvg(this.getWidth, 0.2*this.getHeight, this.sign)
    // svg.style.width = this.getWidth+'px'
    // svg.style.height = 0.2*this.getHeight+'px'
    // svg.setAttribute('viewBox', `0 0 ${this.getWidth} ${this.getHeight}`)
    this.host.nativeElement.querySelector(".back > .sign").innerHTML = ''
    this.host.nativeElement.querySelector(".back > .sign").innerHTML = svg.outerHTML
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size'] && changes['size'].previousValue !== changes['size'].currentValue) {
      this.setSize(changes['size'].currentValue)
    }
    if (changes['sign'] && changes['sign'].previousValue !== changes['sign'].currentValue) {
      this.setSign()
    }
    if (changes['text'] && this.text) {
      this.text = this.text.replace(/\n/g, '<br>')
    }
  }

}

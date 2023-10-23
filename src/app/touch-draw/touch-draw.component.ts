import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef, Output, EventEmitter } from '@angular/core'
import { Touch } from '../touch.service'
import { ReadFileService } from '../services/read-file.service'

@Component({
  selector: 'app-touch-draw',
  templateUrl: './touch-draw.component.html',
  styleUrls: ['./touch-draw.component.scss']
})
export class TouchDrawComponent implements OnInit {

  @Input() touch: Touch | null = null
  @Input() tool: 'pen' | 'eraser' = 'pen'
  @Input() ban: any = []
  @Input() color: string = '#000'
  @Input() value: string = ''
  @Input() sublimereset: boolean = false
  @Input() sublimesave: boolean = false
  @HostBinding('style.width.px') @Input() width: number = 0
  @HostBinding('style.height.px') @Input() height: number = 0
  @Output() save: EventEmitter<string> = new EventEmitter<string>()

  private sizepen = 0.01
  private sizeeraser = 0.1

  constructor(
    private host: ElementRef,
    private readFileService: ReadFileService
  ) { }

  insideRect(rect: Array<number>, point: any): boolean {
    if (point.x > rect[0]*this.width && point.x < +rect[2]*this.width) {
      if (point.y > rect[1]*this.height && point.y < rect[3]*this.height) {
        return true
      }
    }
    return false
  }

  act(): void {
    if (this.touch === null) return

    const cnvs = this.host.nativeElement.querySelector(".canvas")
    const ctx = cnvs.getContext("2d")
    const bounding = cnvs.getBoundingClientRect()

    if (this.tool === 'pen') {
      let x = this.touch!.x-bounding.x
      let y = this.touch!.y-bounding.y
      for (let i = 0; i < this.ban.length; i++) {
        if (this.insideRect(this.ban[i], { x, y })) {
          return
        }
      }
      if (this.touch!.action === 'start') {
        ctx.beginPath()
        ctx.arc(x, y, this.sizepen*this.width/2, 0, 2*Math.PI)
        ctx.fillStyle = this.color
        ctx.fill()
      } else if (this.touch!.action === 'move') {
        let xprev = this.touch!.prev!.x-bounding.x
        let yprev = this.touch!.prev!.y-bounding.y
        for (let i = 0; i < this.ban.length; i++) {
          if (this.insideRect(this.ban[i], { x: xprev, y: yprev })) {
            return
          }
        }
        ctx.beginPath()
        ctx.moveTo(xprev, yprev)
        ctx.lineTo(x, y)
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.sizepen*this.width
        ctx.stroke()
      }
    } else if (this.tool === 'eraser') {
      if (this.touch!.action === 'start' || this.touch!.action === 'move') {
        ctx.clearRect(this.touch!.x-bounding.x-(this.sizeeraser*this.width)/2, this.touch!.y-bounding.y-(this.sizeeraser*this.width)/2, this.sizeeraser*this.width, this.sizeeraser*this.width)
      }
    }
  }

  async setImg(): Promise<void> {
    const img = await this.readFileService.getImageByUrl(this.value)
    const cnvs = this.host.nativeElement.querySelector(".canvas")
    const ctx = cnvs.getContext("2d")
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.drawImage(img, 0, 0, this.width, this.height)
    return new Promise(res => res())
  }

  async getImg(): Promise<void> {
    const cnvs = this.host.nativeElement.querySelector(".canvas")
    this.save.emit(cnvs.toDataURL('image/png', 1))
    return new Promise(res => res())
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.act()
    }
    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      if (changes['value'].currentValue && changes['value'].currentValue !== '') {
        this.setImg()
      }
    }
    if (changes['sublimereset'] && changes['sublimereset'].previousValue !== changes['sublimereset'].currentValue && changes['sublimereset'].previousValue !== undefined) {
      this.setImg()
    }
    if (changes['sublimesave'] && changes['sublimesave'].previousValue !== changes['sublimesave'].currentValue && changes['sublimesave'].previousValue !== undefined) {
      this.getImg()
    }
  }

}

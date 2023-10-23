import { Component, OnInit, Input, HostBinding, ElementRef, SimpleChanges, Output, EventEmitter } from '@angular/core'
import { Touch } from '../touch.service'
import { LinerSvgService } from '../services/liner-svg.service'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-touch-draw-svg',
  templateUrl: './touch-draw-svg.component.html',
  styleUrls: ['./touch-draw-svg.component.scss']
})
export class TouchDrawSvgComponent implements OnInit {

  @HostBinding('style.width.px') @Input() width: number = 0
  @HostBinding('style.height.px') @Input() height: number = 0
  @Input() touch: any = null
  @Input() points: Array<any> = []
  @Input() tool: 'pen' | 'eraser' = 'pen'
  @Input() color: string = '#000'
  @Input() ban: any = []
  @Input() sublimereset: boolean = false
  @Input() sublimesave: boolean = false
  @Output() save: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()

  private cachedPoints: Array<any> = []

  public inn: any = ''

  constructor(
    private linerSvgService: LinerSvgService,
    private host: ElementRef,
    private asyncService: AsyncService
  ) { }

  insideRect(rect: Array<number>, point: any): boolean {
    if (point.x > rect[0] && point.x < rect[2]) {
      if (point.y > rect[1] && point.y < rect[3]) {
        return true
      }
    }
    return false
  }

  checkBan(x: number, y: number): boolean {
    for (let i = 0; i < this.ban.length; i++) {
      if (this.insideRect(this.ban[i], { x, y })) {
        return false
      }
    }
    return true
  }

  doErase(x: number, y: number): void {
    const sizeEraser = 0.1
    const heightEraser = (this.width*sizeEraser)/this.height
    for (let i = 0; this.points[i] && i < this.points.length; i++) {
      for (let j = 1; this.points[i] && this.points[i][j] && j < this.points[i].length; j++) {
        if (this.insideRect([x-sizeEraser/2, y-heightEraser/2, x+sizeEraser/2, y+heightEraser/2], {x: this.points[i][j][0], y: this.points[i][j][1]})) {
          let color = this.points[i][0]
          let arr1 = this.points[i].slice(1, j)
          let arr2 = this.points[i].slice(j+1, this.points[i].length)
          if (arr1[0] && !arr2[0]) {
            arr1.splice(0, 0, color)
            this.points.splice(i, 1, arr1)
            i++
          } else if (!arr1[0] && arr2[0]) {
            arr2.splice(0, 0, color)
            this.points.splice(i, 1, arr2)
          } else if (arr1[0] && arr2[0]) {
            arr1.splice(0, 0, color)
            arr2.splice(0, 0, color)
            this.points.splice(i, 1, arr1, arr2)
            i++
          } else if (!arr1[0] && !arr2[0]) {
            this.points.splice(i, 1)
          }
          j = 1
        }
      }
    }
  }

  async processTouch(): Promise<void> {
    if (this.touch === null) return

    const bounding = this.host.nativeElement.getBoundingClientRect()

    if (this.touch.action === 'start') {
      const x = (this.touch.x-bounding.x)/this.width
      const y = (this.touch.y-bounding.y)/this.height

      if (this.tool === 'pen') {
        this.points.push([this.color])
        if (this.checkBan(x, y)) {
          this.points[this.points.length-1].push([x+3/this.width, y])
          this.points[this.points.length-1].push([x, y])
        }
      } else if (this.tool === 'eraser') {
        this.doErase(x, y)
      }
      this.setImage()
    }
    if (this.touch.action === 'move') {
      const x = (this.touch.x-bounding.x)/this.width
      const y = (this.touch.y-bounding.y)/this.height
      if (this.tool === 'pen') {
        if (this.checkBan(x, y)) this.points[this.points.length-1].push([x, y])
      } else if (this.tool === 'eraser') {
        this.doErase(x, y)
      }
      this.setImage()
    }
    if (this.touch.action === 'end') {
      let svgs = this.host.nativeElement.querySelectorAll('svg')
      for (let i = 0; i < svgs.length-1; i++) { svgs[i].remove() }
    }
  }

  setImage(): void {
    let svg = this.linerSvgService.getSvg(this.width, this.height, this.points)
    svg.style.width = `${this.width}px`
    svg.style.height = `${this.height}px`
    let svgs = this.host.nativeElement.querySelectorAll('svg')
    for (let i = 0; i < svgs.length; i++) { svgs[i].style.display = 'none' }
    this.host.nativeElement.appendChild(svg)
  }

  getImage(): Promise<void> {
    this.save.emit(this.points)
    return new Promise(res => res())
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['width'] && changes['width'].previousValue !== changes['width'].currentValue) {
    //   this.host.nativeElement.querySelector('svg').setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
    // }
    // if (changes['height'] && changes['height'].previousValue !== changes['height'].currentValue) {
    //   this.host.nativeElement.querySelector('svg').setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
    // }
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.processTouch()
    }
    if (changes['points'] && changes['points'].previousValue !== changes['points'].currentValue) {
      if (changes['points'].currentValue && changes['points'].currentValue !== []) {
        this.cachedPoints = [...this.points]
        this.setImage()
      }
    }
    if (changes['sublimereset'] && changes['sublimereset'].previousValue !== changes['sublimereset'].currentValue && changes['sublimereset'].previousValue !== undefined) {
      this.points = [...this.cachedPoints]
      this.setImage()
    }
    if (changes['sublimesave'] && changes['sublimesave'].previousValue !== changes['sublimesave'].currentValue && changes['sublimesave'].previousValue !== undefined) {
      this.getImage()
    }
  }

}

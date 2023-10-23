import { Component, OnInit, Input, SimpleChanges, ElementRef, Output, EventEmitter } from '@angular/core'
import { Touch } from '../touch.service'
import { AsyncService } from '../async.service'
import { GetTargetHtmlService } from '../services/get-target-html.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-listen',
  templateUrl: './touch-listen.component.html',
  styleUrls: ['./touch-listen.component.scss']
})
export class TouchListenComponent implements OnInit {

  @Input() touch!: Touch
  @Input() value!: Array<any>
  @Input() gift: any = null

  @Output() close: EventEmitter<void> = new EventEmitter<void>()

  private audio!: any

  public size: number = 200
  public xcoord: number = 0
  public ycoord: number = 0
  public button: string = 'none'
  public timer: number | string | null = null

  public intervalForTime: any = setInterval(() => {}, 100000)

  private memory: Array<number> = [0, 0]

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService,
    private getTargetHtmlService: GetTargetHtmlService,
    public locationService: LocationService
  ) { }

  setSize(): void {
    this.size = 1.5*window.innerWidth
  }

  async tryPlay(): Promise<void> {
    try {
      await this.audio.play()
      this.timer = 'loading'
      clearInterval(this.intervalForTime)
      this.intervalForTime = setInterval(() => {
        this.setTime()
      }, 1000)
    } catch {
      await this.asyncService.delay(500)
      this.tryPlay()
    }
  }

  pause(): void {
    this.audio.pause()
    clearInterval(this.intervalForTime)
  }

  processTouch(): void {
    if (!this.touch) return

    if (this.touch.action === 'start') {
      this.memory = [this.xcoord, this.ycoord]
    }

    if (this.touch.action === 'move') {
      let x = this.memory[0]+this.touch.x-this.touch.start!.x
      let y = this.memory[1]+this.touch.y-this.touch.start!.y
      if (x < -window.innerWidth/2-this.size/2) x = -window.innerWidth/2-this.size/2
      if (x > window.innerWidth/2+this.size/2) x = window.innerWidth/2+this.size/2
      if (y < -window.innerHeight/2-(this.size/(299/136))/2) y = -window.innerHeight/2-(this.size/(299/136))/2
      if (y > window.innerHeight/2+(this.size/(299/136))/2) y = window.innerHeight/2+(this.size/(299/136))/2
      this.xcoord = x
      this.ycoord = y
    }

    if (this.touch.action === 'end' && !this.touch.drag) {
      const target = this.getTargetHtmlService.get(this.touch.target as HTMLElement, 'button')
      if (target === null) {
        this.pause()
        this.close.emit()
      } else {
        if (target.classList[1] === 'play') {
          this.button = 'play'
          this.tryPlay()
        } else if (target.classList[1] === 'pause') {
          this.button = 'pause'
          this.pause()
        } else if (target.classList[1] === 'prev') {
          this.button = 'prev'
          this.audio.currentTime -= 5
          this.setTime()
          setTimeout(() => { this.button = 'none' }, 200)
        } else if (target.classList[1] === 'next') {
          this.button = 'next'
          this.audio.currentTime += 5
          this.setTime()
          setTimeout(() => { this.button = 'none' }, 200)
        }
      }
    }
  }

  setTime(): void {
    if (this.audio.duration === Infinity) {
      this.timer = 'loading'
    } else {
      this.timer = Math.ceil(this.audio.duration-this.audio.currentTime)
    }
  }

  ngOnInit(): void {
    this.setSize()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.processTouch()
    }
    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      if (changes['value'].currentValue !== null && changes['value'].currentValue[0]) {
        this.audio = new Audio(URL.createObjectURL(changes['value'].currentValue[0]))
        this.audio.onended = () => {
          this.audio.play()
          // clearInterval(this.intervalForTime)
          // this.button = 'none'
          // this.audio.currentTime = 0
          // this.setTime()
        }
      }
    }
  }

}

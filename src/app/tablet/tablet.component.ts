import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-tablet',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.scss']
})
export class TabletComponent implements OnInit {

  @Input() video: string = ''
  @Input() control: string = 'none'
  @Input() size: number = 600
  @Input() color: string = "#C0C0C0" // #C0C0C0 - pure silver; #69abce - Sierra blue; #005f56 - Alpine green; #FFDF4F - shinging gold; #2b2031 - dark matter
  @Input() @HostBinding('class.smooth') smooth: boolean = false

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService
  ) { }

  public math = Math

  private ratio1: number = 247/178
  private ratio2: number = 247/6

  public width: number = this.size
  public height: number = this.size/this.ratio1
  public depth: number = this.size/this.ratio2

  public radius: number = 0.05*this.width
  public widthpath: number = (this.radius*Math.sin(30*(2*Math.PI/360)))/Math.sin(75*(2*Math.PI/360))

  public opacityIcon: string = '0'

  setSize(): void {
    this.width = this.size
    this.height = this.size/this.ratio1
    this.depth = this.size/this.ratio2
    this.radius = 0.05*this.width
    this.widthpath = (this.radius*Math.sin(30*(2*Math.PI/360)))/Math.sin(75*(2*Math.PI/360))
  }

  async play(): Promise<void> {
    try {
      await this.host.nativeElement.querySelector(".screen > .display > .video").play()
    } catch {
      await this.asyncService.delay(500)
      this.play()
    }
  }

  pause(): void {
    this.host.nativeElement.querySelector(".screen > .display > .video").pause()
  }

  prev(): void {
    this.host.nativeElement.querySelector(".screen > .display > .video").currentTime -= 5
  }

  next(): void {
    this.host.nativeElement.querySelector(".screen > .display > .video").currentTime += 5
  }

  async showIcon(type: string): Promise<void> {
    let icon = this.host.nativeElement.querySelector(".screen > .display > .icon")
    if (type === 'play') {
      icon.style.backgroundImage = 'url(../../assets/play.svg)'
    } else if (type === 'pause') {
      icon.style.backgroundImage = 'url(../../assets/pause.svg)'
    } else if (type === 'prev') {
      icon.style.backgroundImage = 'url(../../assets/prev.svg)'
    } else if (type === 'next') {
      icon.style.backgroundImage = 'url(../../assets/next.svg)'
    }
    await this.asyncService.delay(10)
    this.opacityIcon = '1'
    await this.asyncService.delay(200)
    this.opacityIcon = '0'
    await this.asyncService.delay(200)
    return new Promise(res => res())
  }

  endVideo(): void {
    this.play()
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size'] && changes['size'].previousValue !== changes['size'].currentValue) {
      this.setSize()
    }
    if (changes['control']) {
      if (changes['control'].currentValue === 'play') {
        this.play()
        this.showIcon('play')
      } else if (changes['control'].currentValue === 'pause') {
        this.pause()
        this.showIcon('pause')
      } else if (changes['control'].currentValue === 'prev') {
        this.prev()
        this.showIcon('prev')
      } else if (changes['control'].currentValue === 'next') {
        this.next()
        this.showIcon('next')
      }
    }
    if (changes['video'] && changes['video'].currentValue && changes['video'].currentValue !== '') {
      setTimeout(() => {
        this.host.nativeElement.querySelector(".screen > .display > .video").setAttribute("src", this.video)
      }, 1000)
    }
  }

}

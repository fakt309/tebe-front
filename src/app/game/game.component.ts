import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(
    private asyncservice: AsyncService,
    private host: ElementRef
  ) { }

  @Input() size: number = 100
  @Input() color: string = '#003791'
  @Input() front: string = '../../assets/game/example.jpg'
  @Input() inside: string = '../../assets/game/game.png'
  @Input() side: string = '../../assets/game/gameleft.png'
  @Input() code: any = 'WERB-NBHP-DXCV-ZZKL-UIFM'
  @Input() open: boolean = false

  @Input() @HostBinding('class.smooth') smooth: boolean = false

  public ratio1: number = 135/190
  public ratio2: number = 135/15

  public width: number = this.size
  public height: number = this.size/this.ratio1
  public depth: number = this.size/this.ratio2

  public rotateCover: number = 0

  public sizeCorner: number = this.width*0.1
  public sizePartCorner: number = this.sizeCorner/(Math.cos((22.5/180)*Math.PI)+Math.cos((45/180)*Math.PI)+Math.cos((67.5/180)*Math.PI))
  public shiftPartCorner1: any = {
    x: this.sizePartCorner*Math.cos((45/180)*Math.PI)/2+this.sizePartCorner*Math.cos((22.5/180)*Math.PI)/2,
    y: this.sizePartCorner*Math.sin((45/180)*Math.PI)/2+this.sizePartCorner*Math.sin((22.5/180)*Math.PI)/2
  }
  public shiftPartCorner2: any = this.sizePartCorner*Math.cos((45/180)*Math.PI)/2+this.sizePartCorner*Math.sin((22.5/180)*Math.PI)
  public shiftPartCorner3: any = {
    x: 3*this.sizePartCorner*Math.cos((22.5/180)*Math.PI)/2,
    y: 3*this.sizePartCorner*Math.sin((22.5/180)*Math.PI)/2
  }
  public shiftPartCorner4: any = {
    x: 3*this.sizePartCorner*Math.cos((45/180)*Math.PI)/2,
    y: 3*this.sizePartCorner*Math.sin((45/180)*Math.PI)/2
  }

  setSize(): void {
    this.width = this.size
    this.height = this.size/this.ratio1
    this.depth = this.size/this.ratio2

    this.sizeCorner = this.width*0.1
    this.sizePartCorner = this.sizeCorner/(Math.cos((22.5/180)*Math.PI)+Math.cos((45/180)*Math.PI)+Math.cos((67.5/180)*Math.PI))
    this.shiftPartCorner1 = {
      x: this.sizePartCorner*Math.cos((45/180)*Math.PI)/2+this.sizePartCorner*Math.cos((22.5/180)*Math.PI)/2,
      y: this.sizePartCorner*Math.sin((45/180)*Math.PI)/2+this.sizePartCorner*Math.sin((22.5/180)*Math.PI)/2
    }
    this.shiftPartCorner2 = this.sizePartCorner*Math.cos((45/180)*Math.PI)/2+this.sizePartCorner*Math.sin((22.5/180)*Math.PI)
    this.shiftPartCorner3 = {
      x: 3*this.sizePartCorner*Math.cos((22.5/180)*Math.PI)/2,
      y: 3*this.sizePartCorner*Math.sin((22.5/180)*Math.PI)/2
    }
    this.shiftPartCorner4 = {
      x: 3*this.sizePartCorner*Math.cos((45/180)*Math.PI)/2,
      y: 3*this.sizePartCorner*Math.sin((45/180)*Math.PI)/2
    }
  }

  async setSizeSmooth(from: number, to: number): Promise<void> {
    const memory = this.smooth
    this.smooth = false

    this.size = to
    this.setSize()
    this.host.nativeElement.style.transform = `scale(${from/to})`
    this.depth = from/this.ratio2
    await this.asyncservice.delay(10)
    this.smooth = true
    await this.asyncservice.delay(10)
    this.host.nativeElement.style.transform = `scale(1)`
    this.depth = to/this.ratio2
    await this.asyncservice.delay(300)

    this.smooth = memory
    return new Promise(res => res())
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size'] && changes['size'].previousValue !== changes['size'].currentValue) {
      if (this.smooth && changes['size'].previousValue) {
        this.setSizeSmooth(changes['size'].previousValue, changes['size'].currentValue)
      } else {
        this.setSize()
      }
    }
    if (changes['open'] && changes['open'].previousValue !== changes['open'].currentValue) {
      if (changes['open'].currentValue) {
        this.rotateCover = -180
      } else {
        this.rotateCover = 0
      }
    }

  }

}

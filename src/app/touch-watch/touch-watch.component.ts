import { Component, OnInit, SimpleChanges, Input, ElementRef } from '@angular/core'
import { Touch, Touch2Service } from '../services/touch2.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-watch',
  templateUrl: './touch-watch.component.html',
  styleUrls: ['./touch-watch.component.scss']
})
export class TouchWatchComponent implements OnInit {

  public size: number = 200
  public obs: any = null

  public canMove: boolean = false
  public ycoord: number = 0
  public ymemory: number = 0

  public control: string = 'none'

  public pause: boolean = true

  private dblflag: boolean = false
  private dbltimeout: any = setTimeout(() => {}, 0)

  @Input() active: boolean = false
  @Input() video: string = ''

  constructor(
    private touch2Service: Touch2Service,
    private host: ElementRef,
    public locationService: LocationService
  ) { }

  processTouch(t: Touch): void {
    if (t.action === 'move' && t.prev!.action === 'start') {
      if (Math.abs(t.x-t.prev!.x) > Math.abs(t.y-t.prev!.y)) {
        this.canMove = false
      } else {
        this.canMove = true
        this.ymemory = this.ycoord
      }
    }

    if (t.action === 'end') {
      if (!this.dblflag) {
        this.dblflag = true
        this.dbltimeout = setTimeout(() => {
          if (this.dblflag && t.drag === false) this.dotap(t)
          this.dblflag = false
        }, 200)
      } else if (this.dblflag) {
        this.dblflag = false
        this.dodbl(t)
      }
    }

    if (t.action === 'move') {
      this.dblflag = false
    }

    if (t.action === 'move' && this.canMove) {
      let y = this.ymemory+(t.y-t.start!.y)
      if (y > window.innerHeight/2) y = window.innerHeight/2
      if (y < -window.innerHeight/2) y = -window.innerHeight/2
      this.ycoord = y
    }
  }

  dotap(t: Touch) {
    if (this.pause) {
      this.control = 'play'
    } else if (!this.pause) {
      this.control = 'pause'
    }
    this.pause = !this.pause
    setTimeout(() => { this.control = 'none' }, 200)
  }

  dodbl(t: Touch) {
    if (t.x > window.innerWidth/2) {
      this.control = 'next'
    } else {
      this.control = 'prev'
    }
    setTimeout(() => { this.control = 'none' }, 200)
  }

  setSize(): void {
    if ((window.innerWidth/window.innerHeight) > (247/178)) {
      this.size = 0.9*window.innerHeight*((247/178))
    } else {
      this.size = 0.9*window.innerWidth
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && changes['active'].previousValue !== changes['active'].currentValue) {
      if (changes['active'].currentValue) {
        this.setSize()
        this.obs = this.touch2Service.listen(this.host.nativeElement).subscribe((t: Touch) => {
          this.processTouch(t)
        })
      } else {
        if (this.obs !== null) this.obs.unsubscribe()
      }
    }
  }

}

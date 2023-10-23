import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef, HostListener, Output, EventEmitter } from '@angular/core'
import { AsyncService } from '../async.service'
import { Touch2Service, Touch } from '../services/touch2.service'
import { Observable } from 'rxjs'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-confirm',
  templateUrl: './touch-confirm.component.html',
  styleUrls: ['./touch-confirm.component.scss']
})
export class TouchConfirmComponent implements OnInit {

  @Input() value: string = ''

  @Output() result: EventEmitter<'agree'|'reject'> = new EventEmitter<'agree'|'reject'>()

  @HostBinding('class.smooth') smooth: boolean = false
  @HostBinding('style.display') display: string = 'none'
  @HostBinding('style.opacity') opacity: string = '0'
  ycoord: number = -200

  private canHide: boolean = false
  private velocity: number = 0
  private timeoutVelocity: any = setTimeout(() => {}, 0)

  public obs: any = null

  constructor(
    private asyncService: AsyncService,
    private touch2Service: Touch2Service,
    private host: ElementRef,
    public locationService: LocationService
  ) { }

  @HostListener("click")
  onClick() {
    this.result.emit('agree')
    this.doHide()
  }

  async doShow(): Promise<void> {
    this.display = 'flex'
    this.smooth = true
    await this.asyncService.delay(10)
    this.opacity = '1'
    this.ycoord = 0
    await this.asyncService.delay(300)
    this.smooth = false
    return new Promise(res => res())
  }

  async doHide(): Promise<void> {
    this.smooth = true
    await this.asyncService.delay(10)
    this.opacity = '0'
    this.ycoord = -200
    await this.asyncService.delay(300)
    this.display = 'none'
    this.smooth = false
    this.result.emit('reject')
    this.value = ''
    return new Promise(res => res())
  }

  processTouch(t: Touch): void {
    if (this.display === 'none') return

    if (t.action === 'move' && t.prev?.action === 'start') {
      if (Math.abs(t.x-t.prev.x) < Math.abs(t.y-t.prev.y)) {
        this.canHide = true
      } else {
        this.canHide = false
      }
    }
    if (t.action === 'move' && this.canHide) {
      this.velocity = t.y-t.prev!.y
      clearTimeout(this.timeoutVelocity)
      this.timeoutVelocity = setTimeout(() => { this.velocity = 0}, 100);
      let y = t.y-t.start!.y
      if (y > 0) y = 0
      if (y < - 200) y = -200
      this.opacity = `${1+y/200}`
      this.ycoord = y
    }
    if (t.action === 'end' && this.canHide) {
      if (this.velocity === 0) {
        let y = t.y-t.start!.y
        if (y > 0) y = 0
        if (y < - 200) y = -200
        if (y < -100) {
          this.doHide()
        } else if (y > -100) {
          this.doShow()
        }
      } else {
        if (this.velocity > 0) {
          this.doShow()
        } else if (this.velocity < 0) {
          this.doHide()
        }
      }
    }
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      if (changes['value'].currentValue !== '') {
        this.doShow()
        this.obs = this.touch2Service.listen(this.host.nativeElement).subscribe((t: Touch) => {
          this.processTouch(t)
        })
      } else {
        this.doHide()
        if (this.obs !== null) this.obs.unsubscribe()
      }
    }
  }

}

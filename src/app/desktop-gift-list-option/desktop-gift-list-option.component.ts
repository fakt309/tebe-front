import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, SimpleChanges, ViewContainerRef } from '@angular/core'
import { AsyncService } from '../async.service'
import { ConfirmService } from '../services/confirm.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-desktop-gift-list-option',
  templateUrl: './desktop-gift-list-option.component.html',
  styleUrls: ['./desktop-gift-list-option.component.scss']
})
export class DesktopGiftListOptionComponent implements OnInit, OnChanges {

  @Input() gift: any = null
  @Input() showMove: boolean = false

  @Input() sublimeStartRotate: boolean = false
  @Input() sublimeStopRotate: boolean = false

  @Output() startMove: EventEmitter<any> = new EventEmitter<any>()
  @Output() edit: EventEmitter<any> = new EventEmitter<any>()
  @Output() delete: EventEmitter<any> = new EventEmitter<any>()

  rotateGifts: number = 0
  intervalRotateGifts: any = setInterval(() => {}, 99999)
  animateGifts: boolean = false

  buttonsDisabled: boolean = false

  constructor(
    private asyncService: AsyncService,
    public host: ElementRef,
    private confirmService: ConfirmService,
    private hostContainer: ViewContainerRef,
    public locationService: LocationService
  ) { }

  pushMove(e: any): void {
    this.startMove.emit({
      gift: this.gift,
      rect: this.host.nativeElement.getBoundingClientRect(),
      event: e
    })
  }

  clickAdd(): void {
    this.edit.emit({
      gift: this.gift,
      rect: this.host.nativeElement.getBoundingClientRect()
    })
  }

  clickDelete(e: any): void {
    this.buttonsDisabled = true
    this.confirmService.show(this.hostContainer, e.target, this.locationService.translate('Are you sure?', 'Вы уверены?'), (res: boolean): void => {
      if (res) this.delete.emit(this.gift)
      this.buttonsDisabled = false
      this.confirmService.hide()
    })
  }

  startRotateGifts(): void {
    let speed = 1
    clearInterval(this.intervalRotateGifts)
    this.intervalRotateGifts = setInterval(() => {
      this.rotateGifts += speed
      if (this.rotateGifts > 360) this.rotateGifts -= 360
    }, 10)
  }

  async stopRotateGifts(): Promise<void> {
    this.animateGifts = true
    await this.asyncService.delay(10)
    clearInterval(this.intervalRotateGifts)
    if (this.rotateGifts < 180) {
      this.rotateGifts = 0
    } else {
      this.rotateGifts = 360
    }
    await this.asyncService.delay(200)
    this.animateGifts = false
    return new Promise(res => res())
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sublimeStartRotate'] && changes['sublimeStartRotate'].previousValue !== undefined && changes['sublimeStartRotate'].previousValue !== changes['sublimeStartRotate'].currentValue) {
      this.startRotateGifts()
    }
    if (changes['sublimeStopRotate'] && changes['sublimeStopRotate'].previousValue !== undefined && changes['sublimeStopRotate'].previousValue !== changes['sublimeStopRotate'].currentValue) {
      this.stopRotateGifts()
    }
  }

}

import { Component, OnInit, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core'
import { Touch } from '../touch.service'
import { ConvertColorService } from '../services/convert-color.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-slide-money',
  templateUrl: './touch-slide-money.component.html',
  styleUrls: ['./touch-slide-money.component.scss']
})
export class TouchSlideMoneyComponent implements OnInit, OnChanges {

  @Input() options: Array<number> = []
  @Input() currencyName: string = '$'
  @Input() touch: Touch | null = null
  @Input() active: number = 0
  @Output() complete: EventEmitter<void> = new EventEmitter<void>()
  @Output() onChange: EventEmitter<number> = new EventEmitter<number>()

  rectHost!: any

  timestampEnd: number = 0

  constructor(
    public host: ElementRef,
    private converColorService: ConvertColorService,
    public locationService: LocationService
  ) { }

  processTouch(): void {
    if (!this.touch) return

    if (this.touch.action === 'end') {
      if ((this.touch.timestamp-this.timestampEnd) <= 300) {
        this.complete.emit()
      }

      this.timestampEnd = this.touch.timestamp || 0
    }
  }

  getColor(index: number): string {
    return this.converColorService.rgbToHex(index*255/this.options.length, 255-index*255/this.options.length, 255-index*255/this.options.length)
  }

  ngOnInit(): void {
    this.rectHost = this.host.nativeElement.getBoundingClientRect()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.processTouch()
    }
  }

}

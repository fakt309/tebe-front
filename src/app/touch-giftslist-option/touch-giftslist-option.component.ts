import { Component, OnInit, Input, ElementRef, SimpleChanges } from '@angular/core'
import { SnapshotGiftService } from '../snapshot-gift.service'

@Component({
  selector: 'app-touch-giftslist-option',
  templateUrl: './touch-giftslist-option.component.html',
  styleUrls: ['./touch-giftslist-option.component.scss']
})
export class TouchGiftslistOptionComponent implements OnInit {

  @Input() gift: any = {}
  @Input() refresh: boolean = false

  constructor(
    private host: ElementRef,
    private snapshotgiftservice: SnapshotGiftService
  ) { }

  async snapshot(): Promise<void> {
    const img = await this.snapshotgiftservice.get(this.gift)
    this.host.nativeElement.querySelector(".wrap > .ico").style.backgroundImage = 'url('+img+')'
  }

  ngOnInit(): void {
    this.snapshot()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh'] && changes['refresh'].previousValue !== changes['refresh'].currentValue && changes['refresh'].previousValue !== undefined) {
      this.snapshot()
    }
  }

}

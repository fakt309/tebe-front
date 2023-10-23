import { Component, OnInit, Input, ElementRef } from '@angular/core'
import { SnapshotGiftService } from '../snapshot-gift.service'

@Component({
  selector: 'app-touch-giftlistadd-option',
  templateUrl: './touch-giftlistadd-option.component.html',
  styleUrls: ['./touch-giftlistadd-option.component.scss']
})
export class TouchGiftlistaddOptionComponent implements OnInit {

  constructor(
    private host: ElementRef,
    private snapshotgiftservice: SnapshotGiftService
  ) { }

  @Input() display: string = 'none'

  async snapshot(): Promise<void> {
    const img = await this.snapshotgiftservice.get({ type: this.display })
    this.host.nativeElement.querySelector(".wrap > .display").style.backgroundImage = 'url('+img+')'
  }

  ngOnInit(): void {
    this.snapshot()
  }

}

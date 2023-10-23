import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core'
import { Touch } from '../touch.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-empty-giftslist',
  templateUrl: './touch-empty-giftslist.component.html',
  styleUrls: ['./touch-empty-giftslist.component.scss']
})
export class TouchEmptyGiftslistComponent implements OnInit, OnChanges {

  @Input() touch: Touch | null = null

  touchRefresh: Touch | null = null

  constructor(
    public locationService: LocationService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.touchRefresh = this.touch
    }
  }

}

import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { TouchService, Touch } from '../touch.service'
import { Subscription } from 'rxjs'
import { LocationService } from '../services/location.service'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-touch-text-copy',
  templateUrl: './touch-text-copy.component.html',
  styleUrls: ['./touch-text-copy.component.scss']
})
export class TouchTextCopyComponent implements OnInit {

  subs: Array<Subscription> = []

  @Input() text: string = ''

  flagdbl: boolean = false
  timeoutdbl = setTimeout(() => {}, 0)

  animationNameCopy: string = 'a'

  constructor(
    private touchService: TouchService,
    public locationService: LocationService,
    private asyncService: AsyncService
  ) { }

  processTouch(t: Touch): void {
    if (t.action === 'end' && t.drag === false) {
      if (this.flagdbl) {
        this.dbltap()
        this.flagdbl = false
      } else {
        clearTimeout(this.timeoutdbl)
        this.flagdbl = true
        this.timeoutdbl = setTimeout(() => {
          this.flagdbl = false
        }, 200)
      }
    }
  }

  async dbltap(): Promise<void> {
    console.log('DOUBLE')

    navigator.clipboard.writeText(this.text)

    this.animationNameCopy = 'copyAnimation'

    await this.asyncService.delay(1000)

    this.animationNameCopy = ''

    return new Promise(res => res())
  }

  ngOnInit(): void {

    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )

  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

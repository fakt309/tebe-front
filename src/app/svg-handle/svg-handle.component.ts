import { Component, OnInit, ElementRef, SimpleChanges, Input } from '@angular/core'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-svg-handle',
  templateUrl: './svg-handle.component.html',
  styleUrls: ['./svg-handle.component.scss']
})
export class SvgHandleComponent implements OnInit {

  constructor(
    private host: ElementRef,
    private asyncservice: AsyncService
  ) { }

  @Input() bind: boolean = false
  @Input() refresh: boolean | null = null

  binding(): void {
    this.host.nativeElement.querySelector('svg > path:nth-child(1) > animate:nth-child(1)').beginElement()
  }

  unbinding(): void {
    this.host.nativeElement.querySelector('svg > path:nth-child(1) > animate:nth-child(2)').beginElement()
  }

  async dorefresh(): Promise<void> {
    const svg = this.host.nativeElement.querySelector('svg')
    svg.style.transition = 'all ease 0.2s'
    await this.asyncservice.delay(10)
    svg.style.transform = 'translateX(-10px) scale(2)'
    svg.querySelector('path:nth-child(1) > animate:nth-child(3)').beginElement()
    svg.querySelector('path:nth-child(1) > animate:nth-child(5)').beginElement()
    await this.asyncservice.delay(200)
    svg.style.transform = 'translateX(0px) scale(1)'
    svg.querySelector('path:nth-child(1) > animate:nth-child(4)').beginElement()
    svg.querySelector('path:nth-child(1) > animate:nth-child(6)').beginElement()
    await this.asyncservice.delay(200)
    svg.style.removeProperty('transform')
    svg.style.removeProperty('transition')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bind'] && changes['bind'].previousValue !== changes['bind'].currentValue) {
      if (changes['bind'].currentValue) {
        this.binding()
      } else {
        this.unbinding()
      }
    }
    if (changes['refresh'] && changes['refresh'].previousValue !== changes['refresh'].currentValue) {
      this.dorefresh()
    }
  }

  ngOnInit(): void {
  }

}

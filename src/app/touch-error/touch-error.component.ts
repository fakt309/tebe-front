import { Component, OnInit, SimpleChanges, HostBinding, Input } from '@angular/core'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-touch-error',
  templateUrl: './touch-error.component.html',
  styleUrls: ['./touch-error.component.scss']
})
export class TouchErrorComponent implements OnInit {

  @Input() value: string = ''

  @HostBinding('style.display') display: string = 'none'
  @HostBinding('style.top') top: string = '-500px'

  constructor(
    private ayncService: AsyncService
  ) { }

  async doshow(): Promise<void> {
    this.display = 'flex'
    await this.ayncService.delay(10)
    this.top = '20px'
    await this.ayncService.delay(200)
    return new Promise(res => res())
  }

  async dohide(): Promise<void> {
    this.top = '-500px'
    await this.ayncService.delay(200)
    this.display = 'none'
    await this.ayncService.delay(10)
    return new Promise(res => res())
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      if (changes['value'].currentValue === '') {
        this.dohide()
      } else {
        this.doshow()
      }
    }
  }

}

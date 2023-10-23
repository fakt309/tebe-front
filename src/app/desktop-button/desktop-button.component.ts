import { Component, OnInit, Input, HostBinding } from '@angular/core'
import { LightOrDarkService } from '../services/light-or-dark.service'

@Component({
  selector: 'app-desktop-button',
  templateUrl: './desktop-button.component.html',
  styleUrls: ['./desktop-button.component.scss']
})
export class DesktopButtonComponent implements OnInit {

  @Input() text: string = ''
  @Input() icon: string = ''
  @Input() background: string = '#333333'
  @Input() color: string = '#ffffff'
  @Input() disabled: boolean = false

  colorRipple: string = '#00000022'

  constructor(
    private lightOrDark: LightOrDarkService
  ) { }

  setColorRipple(): void {
    if (this.lightOrDark.get(this.background) === 'light') {
      this.colorRipple = '#00000022'
    } else {
      this.colorRipple = '#ffffff22'
    }
  }

  ngOnInit(): void {
    this.setColorRipple()
  }

}

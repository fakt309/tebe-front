import { Component, OnInit } from '@angular/core'
import { IsTouchService } from '../services/is-touch.service'

@Component({
  selector: 'app-page-box',
  templateUrl: './page-box.component.html',
  styleUrls: ['./page-box.component.scss']
})
export class PageBoxComponent implements OnInit {

  typeScreen: string = 'none'

  constructor(
    private isTouch: IsTouchService
  ) { }

  setTypeScreen(): void {
    if (this.isTouch.get()) {
      this.typeScreen = 'touch'
    } else {
      this.typeScreen = 'desktop'
    }
  }

  ngOnInit(): void {
    this.setTypeScreen()
  }

}

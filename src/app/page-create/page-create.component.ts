import { Component, OnInit } from '@angular/core'
import { IsTouchService } from '../services/is-touch.service'

@Component({
  selector: 'app-page-create',
  templateUrl: './page-create.component.html',
  styleUrls: ['./page-create.component.scss']
})
export class PageCreateComponent implements OnInit {

  stage: number = 1

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

  changeStage(stage: number): void {
    this.stage = stage
    // window.localStorage.setItem('globalStage', JSON.stringify(stage))
  }

  ngOnInit(): void {
    // this.stage = JSON.parse(window.localStorage.getItem('globalStage') || '1')

    this.setTypeScreen()
  }

}

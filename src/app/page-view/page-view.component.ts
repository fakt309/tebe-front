import { Component, OnInit } from '@angular/core'
import { IsTouchService } from '../services/is-touch.service'

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {

  typeScreen: 'touch' | 'desktop' = 'touch'

  constructor(
    private isTouchService: IsTouchService
  ) { }

  setTypeScreen(): void {
    if (this.isTouchService.get()) {
      this.typeScreen = 'touch'
    } else {
      this.typeScreen = 'desktop'
    }
  }

  ngOnInit(): void {
    this.setTypeScreen()
  }

}

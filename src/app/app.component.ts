import { Component, ChangeDetectorRef } from '@angular/core'
import { IsTouchService } from './services/is-touch.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tebe'

  constructor(
    private IsTouchService: IsTouchService,
    private changeDetectorRef: ChangeDetectorRef,
    public router: Router
  ) {}

  getTypeScreen(): 'touch' | 'desktop' {
    if (this.IsTouchService.get()) {
      return 'touch'
    }

    return 'desktop'
  }

  isShowLanguage(): boolean {
    const lang = window.sessionStorage.getItem('lang') || null

    if (!lang) {
      return true
    }

    return false
  }

  onSelectLanguage(lang: string): void {
    const url = this.router.url
    window.sessionStorage.setItem('lang', lang)
    window.location.reload()
    // this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
    //   this.router.navigate([url])
    // }); 
  }

}

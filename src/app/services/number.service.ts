import { Injectable } from '@angular/core'
import { LocationService } from './location.service'

@Injectable({
  providedIn: 'root'
})
export class NumberService {

  constructor(
    private locationService: LocationService
  ) { }

  easyAppearence(n: number): string {

    if (n < 100) {
      return `${n}`
    } else if (n >= 1000 && n < 1000000) {
      return `${Math.round(n/1000)} ${this.locationService.translate('k', 'к')}`
    } else if (n >= 1000000 && n < 1000000000) {
      return `${Math.round(n/1000000)} ${this.locationService.translate('m', 'м')}`
    } else if (n >= 1000000000) {
      return `${Math.round(n/1000000000)} ${this.locationService.translate('b', 'мм')}`
    }

    return `${n}`

  }
}

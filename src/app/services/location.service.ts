import { Injectable } from '@angular/core'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private country: number = 0

  private countryCodes = [
    { index: 0, fullName: 'United State', code: 'us' },
    { index: 1, fullName: 'Russia', code: 'ru' }
  ]

  constructor(
    private route: ActivatedRoute
  ) {
    // this.route.queryParams.subscribe((params: any) => {
    //   let code = params['l']
    //   if (!code) return
    //   this.countryCodes.forEach((country: any) => {
    //     if (country.code === code) {
    //       this.country = country.index
    //       return
    //     }
    //   })
    // })

    const code = window.sessionStorage.getItem('lang') || null
    this.countryCodes.forEach((country: any) => {
      if (country.code === code) {
        this.country = country.index
        return
      }
    })
  }

  getCountryByIndex(index: number): any {
    return this.countryCodes.find((country: any) => country.index === index)
  }

  location(): any {
    return {
      country: this.getCountryByIndex(this.country)
    }
  }

  translate(...texts: Array<string>): string {
    return texts[this.country]
  }
}

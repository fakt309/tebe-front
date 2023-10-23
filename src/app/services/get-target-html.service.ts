import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetTargetHtmlService {

  constructor() { }

  get(el: HTMLElement, c: string): HTMLElement | null {
    let isClass = false
    while (!isClass) {
      if (el.tagName === c) {
        isClass = true
        break
      }
      for (let i = 0; i < el.classList.length; i++) {
        if (el.classList[i] === c) {
          isClass = true
          break
        }
      }
      if (el.tagName === 'BODY') {
        isClass = true
        return null
      }
      if (!isClass) el = el.parentNode as HTMLElement
    }
    return el
  }
}

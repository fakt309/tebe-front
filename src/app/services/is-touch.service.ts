import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IsTouchService {

  constructor() { }

  get(): boolean {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  }
}

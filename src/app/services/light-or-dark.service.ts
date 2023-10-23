import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LightOrDarkService {

  constructor() { }

  get(col: string): 'light' | 'dark' {
    let r, g, b, hsp
    let color: any = col

    if (color.match(/^rgb/)) {
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)
      r = color[1]
      g = color[2]
      b = color[3]
    } else {
      color = +("0x"+color.slice(1).replace(color.length < 5 && /./g, '$&$&'))
      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }

    hsp = Math.sqrt(0.299*(r**2)+0.587*(g**2)+0.114*(b**2))

    if (hsp > 127.5) {
      return 'light';
    } else {
      return 'dark';
    }
  }
}

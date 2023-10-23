import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ConvertColorService {

  constructor() { }

  rgbToHex(r: number, g: number, b: number): string {
    r = Math.round(r)
    g = Math.round(g)
    b = Math.round(b)
    return "#"
      + (r.toString(16).length == 1 ? "0"+r.toString(16) : r.toString(16))
      + (g.toString(16).length == 1 ? "0"+g.toString(16) : g.toString(16))
      + (b.toString(16).length == 1 ? "0"+b.toString(16) : b.toString(16))
  }

  // hexToRgb(hex: string): Array<number> | null {
  //   let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  //   return result ? [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ] : null
  // }
}

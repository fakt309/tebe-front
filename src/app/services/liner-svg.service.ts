import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinerSvgService {

  constructor() { }

  getSvg(w: number, h: number, p: Array<any>): any {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.width = w+'px'
    svg.style.height = h+'px'
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    for (let i = 0; i < p.length; i++) {
      let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      let color = p[i][0]
      let d = `M ${p[i][1][0]*w} ${p[i][1][1]*h}`
      for (let j = 2; j < p[i].length; j++) {
        d += ` C ${p[i][j-1][0]*w} ${p[i][j-1][1]*h}, ${p[i][j][0]*w} ${p[i][j][1]*h}, ${p[i][j][0]*w} ${p[i][j][1]*h}`
      }
      path.setAttribute('d', d)
      path.setAttribute('stroke', color)
      path.setAttribute('stroke-width', `${0.01*w}`)
      path.setAttribute('fill', 'transparent')
      svg.appendChild(path)
    }

    return svg
  }
}

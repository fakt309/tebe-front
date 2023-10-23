import { Injectable } from '@angular/core'
import { Observable, fromEvent, merge } from 'rxjs'
import { map, filter, scan } from 'rxjs/operators'

export interface Touch {
  action: string,
  x: number,
  y: number,
  drag: boolean,
  target: HTMLElement,
  start?: Touch,
  prev?: Touch
}

@Injectable({
  providedIn: 'root'
})
export class Touch2Service {

  private drag: boolean = false
  private start!: Touch
  private prev!: Touch

  constructor() { }

  listen(el: HTMLElement): Observable<Touch> {
    const start = fromEvent<TouchEvent>(window, 'touchstart')
      .pipe(
        filter((e: TouchEvent) => e.touches.length == 1),
        map((e: TouchEvent) => {
          const t: Touch = {
            action: 'start',
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            drag: false,
            target: e.target as HTMLElement
          }
          this.start = t
          this.prev = t
          return t
        })
      )
    const move = fromEvent<TouchEvent>(window, 'touchmove')
      .pipe(
        filter((e: TouchEvent) => e.touches.length == 1),
        map((e: TouchEvent) => {
          if (!this.drag) this.drag = true
          const t: Touch = {
            action: 'move',
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            start: this.start,
            prev: this.prev,
            drag: true,
            target: e.target as HTMLElement
          }
          this.prev = t
          return t
        })
      )
    const end = fromEvent<TouchEvent>(window, 'touchend')
      .pipe(
        filter((e: TouchEvent) => e.changedTouches.length == 1),
        map((e: TouchEvent) => {
          const t: Touch = {
            action: 'end',
            x: e.changedTouches[0].clientX,
            y: e.changedTouches[0].clientY,
            start: this.start,
            prev: this.prev,
            drag: this.drag,
            target: e.target as HTMLElement
          }
          this.drag = false
          return t
        })
      )

    return merge(start, move, end)
  }
}

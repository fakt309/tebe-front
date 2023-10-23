import { Injectable, HostListener } from '@angular/core'
import { Subject, fromEvent } from 'rxjs'
import { map, filter, scan } from 'rxjs/operators'

export interface Touch {
  action: string,
  x: number,
  y: number,
  start: Touch | null,
  prev: Touch | null
  drag: boolean,
  target: HTMLElement | null
  timestamp: number
}

@Injectable({
  providedIn: 'root'
})
export class TouchService {

  public stream$: Subject<Touch> = new Subject()

  private drag: boolean = false
  private start: Touch | null = null
  private prev: Touch | null = null
  private touchstart$ = fromEvent<TouchEvent>(window, 'touchstart')
    .pipe(
      filter((e: TouchEvent) => e.touches.length == 1),
      map((e: TouchEvent) => {
        const t: Touch = {
          action: 'start',
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          start: this.start,
          prev: this.prev,
          drag: this.drag,
          target: e.target as HTMLElement,
          timestamp: Date.now()
        }
        this.start = t
        return t
        // return Object.create(e, {
        //   action: { value: 'start' },
        //   x: { value: e.touches[0].clientX },
        //   y: { value: e.touches[0].clientY },
        //   start: { value: this.start },
        //   prev: { value: this.prev },
        //   drag: { value: this.drag },
        //   target: { value: e.target }
        // })
      })
    )
  private touchmove$ = fromEvent<TouchEvent>(window, 'touchmove')
    .pipe(
      filter((e: TouchEvent) => e.touches.length == 1),
      map((e: TouchEvent) => {
        if (!this.drag) this.drag = true
        // return Object.create(e, {
        //   action: { value: 'move' },
        //   x: { value: e.touches[0].clientX },
        //   y: { value: e.touches[0].clientY },
        //   start: { value: this.start },
        //   prev: { value: this.prev },
        //   drag: { value: this.drag },
        //   target: { value: e.target }
        // })
        const t: Touch = {
          action: 'move',
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          start: this.start,
          prev: this.prev,
          drag: this.drag,
          target: e.target as HTMLElement,
          timestamp: Date.now()
        }
        return t
      })
    )
  private touchend$ = fromEvent<TouchEvent>(window, 'touchend')
    .pipe(
      filter((e: TouchEvent) => e.changedTouches.length == 1),
      map((e: TouchEvent) => {
        // return Object.create(e, {
        //   action: { value: 'end' },
        //   x: { value: e.changedTouches[0].clientX },
        //   y: { value: e.changedTouches[0].clientY },
        //   start: { value: this.start },
        //   prev: { value: this.prev },
        //   drag: { value: this.drag },
        //   target: { value: e.target }
        // })
        const t: Touch = {
          action: 'end',
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY,
          start: this.start,
          prev: this.prev,
          drag: this.drag,
          target: e.target as HTMLElement,
          timestamp: Date.now()
        }
        return t
      })
    )

  constructor() {
    this.touchstart$
      .subscribe((t: Touch): void => {
        this.prev = t
        this.stream$.next(t)
      })
    this.touchmove$
      .subscribe((t: Touch): void => {
        this.prev = {...t, prev: null}
        this.stream$.next(t)
      })
    this.touchend$
      .subscribe((t: Touch): void => {
        this.drag = false
        this.start = null
        this.prev = null
        this.stream$.next(t)
      })
  }

}

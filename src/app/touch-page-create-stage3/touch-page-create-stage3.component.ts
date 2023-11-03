import { Component, OnInit, OnDestroy, HostListener } from '@angular/core'
import { TouchService, Touch } from '../touch.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-touch-page-create-stage3',
  templateUrl: './touch-page-create-stage3.component.html',
  styleUrls: ['./touch-page-create-stage3.component.scss']
})
export class TouchPageCreateStage3Component implements OnInit, OnDestroy {

  subs: Array<Subscription> = []

  draw: any = {
    size: { w: 0, h: 0 },
    coord: { x: 0, y: 0 },
    ban: []
  }

  box: any = {
    animate: true,
    packed: false,
    wrapped: false,
    tapped: false,
    package: '../../assets/box/package/4.jpg',
    tape: '../../assets/box/tape/4.jpg',
    coord: { x: 0, y: 0, z: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    size: { w: 100, h: 60, d: 200 }
  }

  public touches: any = {
    draw: null
  }

  public disableds: any = {
    draw: false
  }

  constructor(
    private touchService: TouchService
  ) { }

  @HostListener('window:click', ['$event']) onClick(): void {
    this.setPosition1()
  }

  setPosition1(): void {
    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = this.box.size.w/2
    this.box.coord.z = 0

    this.setDrawSizeAndCoord()
  }

  setDrawSizeAndCoord(): void {
    this.draw.size.w = this.box.size.d+2*this.box.size.h
    this.draw.size.h = 2*this.box.size.w+2*this.box.size.h

    this.draw.ban = [
      [0, 0, this.box.size.h/this.draw.size.w, (this.box.size.w+this.box.size.h)/this.draw.size.h],
      [(this.box.size.d+this.box.size.h)/this.draw.size.w, 0, 1, (this.box.size.w+this.box.size.h)/this.draw.size.h],
      [0, (this.box.size.h+2*this.box.size.w)/this.draw.size.h, this.box.size.h/this.draw.size.w, 1],
      [(this.box.size.d+this.box.size.h)/this.draw.size.w, (this.box.size.h+2*this.box.size.w)/this.draw.size.h, 1, 1]
    ]
  }

  processTouch(t: Touch): void {
    Object.entries(this.disableds).forEach(([k, v]) => {
      if (!v) this.touches[k] = t
    })
  }

  ngOnInit(): void {

    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

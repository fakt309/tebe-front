import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostBinding } from '@angular/core'
import { LocationService } from '../services/location.service'
import { RandomColorService } from '../services/random-color.service'
import gsap from "gsap"

@Component({
  selector: 'app-desktop-empty-giftlist',
  templateUrl: './desktop-empty-giftlist.component.html',
  styleUrls: ['./desktop-empty-giftlist.component.scss']
})
export class DesktopEmptyGiftlistComponent implements OnInit, AfterViewInit {

  @ViewChild('svg', { read: ElementRef, static: false }) svg!: ElementRef
  @ViewChild('group', { read: ElementRef, static: false }) gr!: ElementRef

  paths!: any
  group!: any
  tl!: any

  constructor(
    private host: ElementRef,
    private randomColorService: RandomColorService,
    public locationService: LocationService
  ) { }

  generatePoints(): void {
    this.tl.clear()
    this.group.innerHTML = ''
    let delay = 0
    this.paths.forEach((path: any) => {
      const length = path.getTotalLength()
      for (let i = 0; i < length; i += 3) {
        const pointLength = Math.random() * length
        const point = path.getPointAtLength(pointLength)
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', point.x+(Math.random()-0.5)*60)
        circle.setAttribute('cy', point.y+(Math.random()-0.5)*60)
        circle.setAttribute('stroke', 'none')
        circle.setAttribute('r', `${Math.random()*4+1}`)
        this.group.appendChild(circle)
        this.tl.to(circle, {
          autoRound: false,
          fill: this.randomColorService.get(),
          cx: point.x,
          cy: point.y,
          duration: 'random(1, 3)',
          delay: (delay+pointLength)*0.0005,
          ease: 'power2.out'
        }, 0)
      }
      delay += length;
    });
    // tl.reversed(false).play(0);
  }

  // destroy(tl: any): void {
  //
  // }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
   this.paths = this.svg.nativeElement.querySelectorAll('path')
   this.group = this.gr.nativeElement

   this.tl = gsap.timeline({
     // onReverseComplete: () => {
     //   tl.timeScale(0)
     //   tl.play(0)
     // },
     // onComplete: () => {
     //   tl.timeScale(1.5)
     //   tl.reverse(0)
     // }
   })
   this.generatePoints()

  }

}

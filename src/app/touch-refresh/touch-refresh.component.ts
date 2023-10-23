import { Component, OnInit, Input, SimpleChanges, OnChanges, HostListener, ElementRef, HostBinding, ViewChild } from '@angular/core'
import { Touch } from '../touch.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-touch-refresh',
  templateUrl: './touch-refresh.component.html',
  styleUrls: ['./touch-refresh.component.scss']
})
export class TouchRefreshComponent implements OnInit, OnChanges {

  start: Touch | null = null

  @Input() touch: Touch | null = null

  @HostBinding('style.transition') transition: string = 'none'
  @HostBinding('style.transform') transform: string = 'translateY(-50px)'
  @HostBinding('style.width.px') width: number = 0

  @ViewChild('animate1', { read: ElementRef }) animate1Ref!: ElementRef
  @ViewChild('animate2', { read: ElementRef }) animate2Ref!: ElementRef
  @ViewChild('animate3', { read: ElementRef }) animate3Ref!: ElementRef
  @ViewChild('animate4', { read: ElementRef }) animate4Ref!: ElementRef
  @ViewChild('animate5', { read: ElementRef }) animate5Ref!: ElementRef
  @ViewChild('animate6', { read: ElementRef }) animate6Ref!: ElementRef

  currentAction: string = 'ready'
  animationName: string = 'none'

  constructor(
    private host: ElementRef,
    private router: Router
  ) { }

  @HostListener('window:resize') onResize(): void {
    const w = this.host.nativeElement.parentNode.getBoundingClientRect().width
    this.width = w
  }

  setPosition(pos: number): void {
    this.transform = `translateY(${pos}px)`
  }

  anim(act: string): void {
    if (this.currentAction === act) return
    if (act === 'ready') {
      this.animate2Ref.nativeElement.beginElement()
      this.animate4Ref.nativeElement.beginElement()
      this.animate6Ref.nativeElement.beginElement()
      this.animationName = 'none'
    } else if (act === 'steady') {
      this.animate1Ref.nativeElement.beginElement()
      this.animate3Ref.nativeElement.beginElement()
      this.animate5Ref.nativeElement.beginElement()
      this.animationName = 'none'
    } else if (act === 'go') {
      this.animationName = 'go'
    }
    this.currentAction = act
  }

  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  setTransition(flag: boolean): void {
    if (flag) {
      this.transition = 'all ease 0.3s'
    } else {
      this.transition = 'none'
    }
  }

  processTouch(): void {
    if (this.touch === null) {
      this.setTransition(true)
      setTimeout(() => {
        this.setPosition(-50)
        setTimeout(() => {
          this.setTransition(false)
        }, 300);
      }, 10);
      return
    }

    this.onResize()
    const k = 0.2
    if (this.touch?.action === 'move') {
      let p = (this.touch!.y-this.start!.y)*k-50
      if (p > 0) p = 0
      if (p < -50) p = -50
      if (p === 0) {
        this.anim('steady')
      } else {
        this.anim('ready')
      }
      this.setPosition(p)
    } else if (this.touch?.action === 'end') {
      let p = (this.touch!.y-this.start!.y)*k-50
      if (p > 0) p = 0
      if (p < -50) p = -50

      if (p === 0) {
        this.anim('go')
        setTimeout(() => {
          this.reload()
        }, 300)
      } else {
        this.setTransition(true)
        setTimeout(() => {
          this.setPosition(-50)
          setTimeout(() => {
            this.setTransition(false)
          }, 300);
        }, 10);
      }

      this.start = null
    }
  }

  ngOnInit(): void {
    this.onResize()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      if (this.start === null && changes['touch'].currentValue !== null) {
        this.start = changes['touch'].currentValue.prev
      }
      this.processTouch()
    }
  }

}

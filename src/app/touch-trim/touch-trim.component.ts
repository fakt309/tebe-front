import { Component, OnInit, Input, SimpleChanges, ElementRef, Output, EventEmitter } from '@angular/core'
import { ReadFileService } from '../services/read-file.service'
import { Touch } from '../touch.service'
import { GetTargetHtmlService } from '../services/get-target-html.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-trim',
  templateUrl: './touch-trim.component.html',
  styleUrls: ['./touch-trim.component.scss']
})
export class TouchTrimComponent implements OnInit {

  @Input() img: string = ''
  @Input() ratio: number = 16/9
  @Input() mode: string = 'usual'
  @Input() touch: Touch | null = null
  @Input() sublimesave: boolean = false

  @Output() closetrim: EventEmitter<void> = new EventEmitter<void>()
  @Output() save: EventEmitter<string> = new EventEmitter<string>()

  private imgobj: any = new Image()
  private modemove: 'shift' | 'frame' | 'resize' | 'none' = 'none'
  private startposimage = [0, 0]
  private startposframe = [0, 0]

  public taptransform = 100
  public hintsidebartransform = 0

  public width: number = 0
  public height: number = 0
  public x: number = 0
  public y: number = 0

  public frame: any = {
    w: 0,
    h: 0,
    x: 0,
    y: 0
  }

  private timeouttap = setTimeout(() => {}, 0)
  private flagtap = false

  constructor(
    private readfileservice: ReadFileService,
    private host: ElementRef,
    private gettargethtmlservice: GetTargetHtmlService,
    public locationService: LocationService
  ) { }

  async setobjectimg(): Promise<void> {
    this.imgobj = await this.readfileservice.getImageByUrl(this.img)
    return new Promise(res => res())
  }

  setsize(): void {
    if (this.imgobj.naturalWidth/this.imgobj.naturalHeight >= window.innerWidth/window.innerHeight) {
      this.width = 0.8*window.innerWidth
      if (this.width > this.imgobj.naturalWidth) this.width = this.imgobj.naturalWidth
      this.height = this.width/(this.imgobj.naturalWidth/this.imgobj.naturalHeight)
    } else if (this.imgobj.naturalWidth/this.imgobj.naturalHeight < window.innerWidth/window.innerHeight) {
      this.height = 0.8*window.innerHeight
      if (this.height > this.imgobj.naturalHeight) this.height = this.imgobj.naturalHeight
      this.width = this.height*(this.imgobj.naturalWidth/this.imgobj.naturalHeight)
    }
    this.x = (window.innerWidth-this.width)/2
    this.y = (window.innerHeight-this.height)/2-20
  }

  turnontrim(): void {
    const boundingImage = this.host.nativeElement.querySelector(".image").getBoundingClientRect()
    if (this.ratio >= this.width/this.height) {
      this.frame.w = this.width
      this.frame.h = this.frame.w/this.ratio
    } else if (this.ratio < this.width/this.height) {
      this.frame.h = this.height
      this.frame.w = this.frame.h*this.ratio
    }
    this.frame.x = boundingImage.x+(this.width-this.frame.w)/2
    this.frame.y = boundingImage.y-41+(this.height-this.frame.h)/2

    this.taptransform = 0
    this.hintsidebartransform = 100
  }

  dotrim(): void {
    const cnvs = document.createElement('canvas')
    const ctx = cnvs.getContext('2d')
    cnvs.setAttribute('width', this.imgobj!.naturalWidth*(this.frame.w/this.width)+'px')
    cnvs.setAttribute('height', this.imgobj!.naturalHeight*(this.frame.h/this.height)+'px')
    ctx!.drawImage(
      this.imgobj!,
      this.imgobj!.naturalWidth*(this.frame.x-this.x)/this.width,
      this.imgobj!.naturalHeight*(this.frame.y-this.y)/this.height,
      this.imgobj!.naturalWidth*(this.frame.w/this.width),
      this.imgobj!.naturalHeight*(this.frame.h/this.height),
      0,
      0,
      this.imgobj!.naturalWidth*(this.frame.w/this.width),
      this.imgobj!.naturalHeight*(this.frame.h/this.height)
    )

    let img = cnvs.toDataURL('image/jpg', 1)
    this.img = img
    this.setobjectimg().then(() => {
      this.setsize()
      this.save.emit(img)
    })

  }

  processTouch(): void {
    if (this.mode !== 'trim') return

    if (this.touch!.action === 'start') {

      this.flagtap = true
      clearTimeout(this.timeouttap)
      this.timeouttap = setTimeout(() => {
        this.flagtap = false
      }, 200)

      if (this.gettargethtmlservice.get(this.touch!.target as HTMLElement, 'resize')) {
        this.modemove = 'resize'
      } else if (this.gettargethtmlservice.get(this.touch!.target as HTMLElement, 'frame')) {
        this.startposframe = [this.frame.x, this.frame.y]
        this.modemove = 'frame'
      } else {
        this.startposimage = [this.x, this.y]
        this.startposframe = [this.frame.x, this.frame.y]
        this.modemove = 'shift'
      }
    }

    if (this.touch!.action === 'move') {
      if (this.modemove === 'resize') {
        this.frame.w = this.touch!.x-this.frame.x
        this.frame.h = this.frame.w/this.ratio
        if (this.frame.w < 30) {
          this.frame.w = 30
          this.frame.h = this.frame.w/this.ratio
        }
        if (this.frame.h < 30) {
          this.frame.h = 30
          this.frame.w = this.frame.h*this.ratio
        }
        if (this.frame.x+this.frame.w > this.x+this.width) {
          this.frame.w = this.x+this.width-this.frame.x
          this.frame.h = this.frame.w/this.ratio
        }
        if (this.frame.y+this.frame.h > this.y+this.height) {
          this.frame.h = this.y+this.height-this.frame.y
          this.frame.w = this.frame.h*this.ratio
        }
      } else if (this.modemove === 'frame') {
        this.frame.x = this.startposframe[0]+this.touch!.x-this.touch!.start!.x
        this.frame.y = this.startposframe[1]+this.touch!.y-this.touch!.start!.y
        if (this.frame.x < this.x) this.frame.x = this.x
        if (this.frame.y < this.y) this.frame.y = this.y
        if (this.frame.x+this.frame.w > this.x+this.width) this.frame.x = this.x+this.width-this.frame.w
        if (this.frame.y+this.frame.h > this.y+this.height) this.frame.y = this.y+this.height-this.frame.h
      } else if (this.modemove === 'shift') {
        this.frame.x = this.startposframe[0]+this.touch!.x-this.touch!.start!.x
        this.frame.y = this.startposframe[1]+this.touch!.y-this.touch!.start!.y
        this.x = this.startposimage[0]+this.touch!.x-this.touch!.start!.x
        this.y = this.startposimage[1]+this.touch!.y-this.touch!.start!.y
        if (this.x < -this.width) {
          this.x = -this.width
          this.frame.x = this.x+(this.startposframe[0]-this.startposimage[0])
        }
        if (this.x > window.innerWidth) {
          this.x = window.innerWidth
          this.frame.x = this.x+(this.startposframe[0]-this.startposimage[0])
        }
        if (this.y < -this.height) {
          this.y = -this.height
          this.frame.y = this.y+(this.startposframe[1]-this.startposimage[1])
        }
        if (this.y > window.innerHeight) {
          this.y = window.innerHeight
          this.frame.y = this.y+(this.startposframe[1]-this.startposimage[1])
        }
      }
    }

    if (this.touch!.action === 'end' && this.touch!.drag === false && this.flagtap) {
      this.closetrim.emit()
    }
  }

  ngOnInit(): void {
    this.closetrim = this.closetrim
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['img'] && changes['img'].previousValue !== changes['img'].currentValue && changes['img'].currentValue !== '') {
      this.setobjectimg().then(() => { this.setsize() })
    }
    if (changes['mode'] && changes['mode'].previousValue !== changes['mode'].currentValue) {
      if (changes['mode'].currentValue === 'usual') {
        this.setsize()
        this.taptransform = 100
        this.hintsidebartransform = 0
      } else if (changes['mode'].currentValue === 'trim') {
        this.turnontrim()
      }
    }
    if (changes['touch'] && changes['touch'].previousValue !== changes['touch'].currentValue) {
      this.processTouch()
    }
    if (changes['sublimesave'] && changes['sublimesave'].previousValue !== changes['sublimesave'].currentValue && changes['sublimesave'].previousValue !== undefined) {
      this.dotrim()
      this.taptransform = 100
      this.hintsidebartransform = 0
    }
  }

}

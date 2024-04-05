import { Component, OnInit, OnDestroy, HostListener, HostBinding, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core'
import { TouchService, Touch } from '../touch.service'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'
import { FormControl } from '@angular/forms'
import { LinerSvgService } from '../services/liner-svg.service'
import { SnapshotGiftService } from '../snapshot-gift.service'
import { ReadFileService } from '../services/read-file.service'
import { OptionMenu } from '../touch-menu/touch-menu.component'
import { ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { ConfirmService } from '../services/confirm.service'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'

@Component({
  selector: 'app-touch-page-create-stage3',
  templateUrl: './touch-page-create-stage3.component.html',
  styleUrls: ['./touch-page-create-stage3.component.scss'],
  animations: [
    trigger('previewTextAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.1)', opacity: '0' }),
        animate('0.5s ease', style({ transform: 'scale(1)', opacity: '1' }))
      ])
    ]),
    trigger('hintTextAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.1)', opacity: '0' }),
        animate('0.5s 0.5s ease', style({ transform: 'scale(1)', opacity: '1' }))
      ])
    ]),
    trigger('stageAnimation', [
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: '1' }),
        animate('0.5s 0.5s ease', style({ transform: 'scale(0.1)', opacity: '0' }))
      ])
    ])
  ]
})
export class TouchPageCreateStage3Component implements OnInit, OnDestroy {

  // @HostBinding('@stageAnimation') stageAnimation: string = ''

  @Output() changeGlobalStage: EventEmitter<number> = new EventEmitter<number>()

  @ViewChild('colorDrawRef', { read: ElementRef }) colorDrawRef!: ElementRef

  math = Math

  subs: Array<Subscription> = []

  draw: any = {
    size: { w: 0, h: 0 },
    coord: { x: 0, y: 0 },
    ban: []
  }

  grid: any = { w: 2, h: 2 }

  box: any = {
    animate: false,
    packed: false,
    wrapped: false,
    tapped: false,
    package: '../../assets/box/package/4.jpg',
    tape: '../../assets/box/tape/1.jpg',
    coord: { x: 0, y: 0, z: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    size: { w: 110, h: 130, d: 120 },
    scale: 1,
    shiftRotate: { x: 0, y: 0 }
  }

  cellInfoForBack: any = {}

  colorDrawControl: FormControl = new FormControl('#000000')
  toolDraw: 'pen' | 'eraser' = 'pen'
  colorDraw: string = '#000000'
  tool: 'pen' | 'eraser' | 'loupe' | 'move' = 'pen'

  wrap: any = {
    x: 0,
    y: 0,
    scale: 1,
    disable: false,
    animated: false
  }

  initialWrap: any = {
    x: 0,
    y: 0,
    scale: 1
  }

  dragGift: any = {
    timeout: setTimeout(() => {}, 0),
    img: null,
    position: { x: 0, y: 0 },
    size: { w: 0, h: 0 },
    animated: false,
    id: null,
    waiting: false,
    allowed: false
  }

  public confirm: any = {
    value: '',
    type: ''
  }

  public menu: Array<OptionMenu> = []
  public menusublimeshow: boolean = false

  public valerror: string = ''
  public timeoutError: any = setTimeout(() => {}, 0)

  showLoupeHint: boolean = false

  contextOptions = [
    { icon: '../../assets/checkmark.svg', title: this.locationService.translate('next stage', 'след. этап'), value: 'next' },
    { hr: true },
    { icon: '../../assets/pen.svg', title: this.locationService.translate('pen', 'карандаш'), value: 'pen' },
    { icon: '../../assets/resize.svg', title: this.locationService.translate('move', 'обзор'), value: 'move' },
    { icon: '../../assets/eraser.svg', title: this.locationService.translate('eraser', 'ластик'), value: 'eraser' },
    { icon: '../../assets/palette.svg', title: this.locationService.translate('color', 'цвет'), value: 'color' },
    { icon: '../../assets/loupe-black.svg', title: this.locationService.translate('loupe', 'лупа'), value: 'loupe' }
  ]

  doscrolltocenterAddGift: boolean = false
  doscrolltocenterNextChoose: boolean = false

  sublimeSaveDrawInside: boolean = false

  stage: number = 0

  gifts: Array<any> = []

  inBox: Array<any> = []
  hiddenGifts: Map<number, boolean> = new Map()

  transition: boolean = false

  public modetrim: string = 'usual'
  public imgtrim: string = ''
  public sublimesavetrim: boolean = false
  public hashedtrim: string | null = null
  public listtrim: string = ''
  public ratiotrim: number = 1/1

  public touches: any = {
    draw: null,
    mainGifts: null,
    screenadd: null,
    dragGift: null,
    mainPackage: null,
    screentrim: null,
    screenlisttrim: null,
    menu: null,
    chooseNext: null,
    mainTape: null
  }

  public disableds: any = {
    draw: true,
    mainGifts: true,
    screenadd: true,
    dragGift: true,
    mainPackage: true,
    screentrim: true,
    screenlisttrim: true,
    menu: true,
    chooseNext: true,
    mainTape: true
  }

  public stats: any = {
    mainGifts: 'close',
    screenadd: 'close',
    dragGift: 'close',
    mainPackage: 'close',
    screentrim: 'close',
    screenlisttrim: 'close',
    menu: 'close',
    chooseNext: 'close',
    mainTape: 'close'
  }

  constructor(
    private touchService: TouchService,
    private asyncService: AsyncService,
    public locationService: LocationService,
    public linerSvgService: LinerSvgService,
    public snapshotGiftService: SnapshotGiftService,
    public host: ElementRef,
    private readFileService: ReadFileService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private confirmService: ConfirmService
  ) { }

  @HostListener('window:click', ['$event']) onClick(): void {
    
  }

  setPosition2NoAnimate(): void {
    this.showScreen('mainGifts')

    this.wrap.animated = false
    this.box.animate = false

    this.wrap.scale = this.getScaleBoxToFitScreen()
    this.wrap.x = 0
    this.wrap.y = 0

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    this.box.packed = false
    this.box.wrapped = false
    this.box.tapped = false

    this.transition = false

  }

  setPosition3NoAnimate(): void {
    this.showScreen('mainPackage')

    this.wrap.animated = false
    this.box.animate = false

    this.wrap.scale = this.getScaleBoxToFitScreen()
    this.wrap.x = 0
    this.wrap.y = 0

    this.wrap.x = 0
    this.wrap.y = 0
    this.wrap.scale = 1

    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    this.box.packed = true
    this.box.wrapped = true
    this.box.tapped = false

    this.transition = false

  }

  async setPosition1(): Promise<void> {
    this.transition = true

    let scale = 0.1

    this.box.animate = false
    await this.asyncService.delay(10)
    this.box.animate = true
    await this.asyncService.delay(10)

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = this.box.size.w/2
    this.box.coord.z = 0

    this.setDrawSizeAndCoord()

    await this.asyncService.delay(300)

    this.transition = false

    return new Promise(res => res())
  }

  async setPosition2(): Promise<void> {
    this.transition = true

    this.showScreen('mainGifts')

    let scale = 0.1

    this.wrap.x = 0
    this.wrap.y = 0
    this.wrap.scale = 1

    this.box.animate = false
    await this.asyncService.delay(10)
    this.box.animate = true
    await this.asyncService.delay(10)

    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    await this.asyncService.delay(1000)

    // this.box.rotate.x = -15
    // this.box.rotate.y = 110+360
    // this.box.rotate.z = 0

    // await this.asyncService.delay(1000)

    // this.box.animate = false

    // await this.asyncService.delay(10)

    // this.box.rotate.y = 110

    // await this.asyncService.delay(10)

    // this.box.animate = true
    this.wrap.animated = true

    await this.asyncService.delay(10)

    this.wrap.scale = this.getScaleBoxToFitScreen()

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    await this.asyncService.delay(300)

    this.wrap.animated = false

    this.transition = false

    return new Promise(res => res())
  }

  async setPositionFrom3To2(): Promise<void> {
    this.transition = true

    this.showScreen('mainGifts')

    this.box.animate = true
    this.wrap.animated = true
    await this.asyncService.delay(10)

    this.box.wrapped = false

    await this.asyncService.delay(6000)

    this.box.packed = false

    await this.asyncService.delay(1000)

    this.wrap.scale = this.getScaleBoxToFitScreen()

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    await this.asyncService.delay(300)

    this.wrap.animated = false

    this.transition = false

    return new Promise(res => res())
  }

  async setPosition3(): Promise<void> {
    this.transition = true

    this.showScreen('mainPackage')

    this.box.animate = true
    this.wrap.animated = true
    await this.asyncService.delay(10)

    this.wrap.x = 0
    this.wrap.y = 0
    this.wrap.scale = 1

    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    await this.asyncService.delay(1000)

    this.box.packed = true

    await this.asyncService.delay(1000)

    this.box.wrapped = true

    await this.asyncService.delay(6000)

    this.box.rotate.y = 200

    await this.asyncService.delay(300)

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())
  }

  async setPositionFrom4To3(): Promise<void> {
    this.transition = true

    this.showScreen('mainPackage')

    this.box.animate = true
    this.wrap.animated = true
    await this.asyncService.delay(10)

    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    this.box.tapped = false

    await this.asyncService.delay(6000)

    this.wrap.animated = false

    this.transition = false

  }

  async setPosition4(): Promise<void> {
    this.transition = true

    this.showScreen('mainTape')

    this.wrap.x = 0
    this.wrap.y = 0
    this.wrap.scale = 1

    this.box.animate = false
    await this.asyncService.delay(10)
    this.box.animate = true
    await this.asyncService.delay(10)

    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    await this.asyncService.delay(300)

    // this.box.rotate.x = -15
    // this.box.rotate.y = 110+360
    // this.box.rotate.z = 0

    // await this.asyncService.delay(1000)

    // this.box.animate = false

    // await this.asyncService.delay(10)

    // this.box.rotate.y = 110

    // await this.asyncService.delay(10)

    // this.box.animate = true
    // this.wrap.animated = true

    // await this.asyncService.delay(10)

    this.box.tapped = true

    await this.asyncService.delay(6000)

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())
  }

  isGiftInBox(gift: any): boolean {
    return this.inBox.find(x => x === gift.id) ? true : false
  }

  getEscalateDOM(el: any, cls: string): any {
    let current = el
    while (current.tagName !== 'BODY') {
      if (current.classList.contains(cls)) {
        return current
        break
      }
      current = current.parentNode
    }
    return null
  }

  getGiftById(id: number): any {
    return this.gifts.find(x => x.id === id) || null
  }

  async showAddGiftMenu(): Promise<void> {
    this.onCloseScreen('mainGifts')
    this.showScreen('screenadd')
    // await this.asyncService.delay(10)
    // this.doscrolltocenterAddGift = !this.doscrolltocenterAddGift

    // console.log(this.gifts)

    return new Promise(res => res())
  }

  getScaleBoxToFitScreen(): number {

    let scale = 1

    // let k = 0.9

    let sizeBox = { w: this.box.size.d, h: this.box.size.w, ratio: this.box.size.d/this.box.size.w }
    let sizeWindow = { w: window.innerWidth, h: window.innerHeight, ratio: window.innerWidth/window.innerHeight }

    if (sizeBox.ratio >= sizeWindow.ratio) {
      scale = sizeWindow.w/sizeBox.w//*k
    } else if (sizeBox.ratio <= sizeWindow.ratio) {
      scale = sizeWindow.h/sizeBox.h//*k
    }

    return scale
  }

  getSizeGift(gift: any): number {
    let k = 0.9;

    if (gift.type === 'greetingcard') {
      return (this.box.size.w/this.grid.h)*(297/420)*k
    } else if (gift.type === 'game') {
      return (this.box.size.w/this.grid.h)*(135/190)*k
    } else if (gift.type === 'speaker') {
      return this.box.size.d/this.grid.w*k
    } else if (gift.type === 'tablet') {
      return this.box.size.d/this.grid.w*k
    } else if (gift.type === 'photo') {
      return (this.box.size.w/this.grid.h)*(48/64)*k
    }

    return 0
  }

  getDepthGift(gift: any): number {
    const size = this.getSizeGift(gift)

    if (gift.type === 'greetingcard') {
      return size/(297/1)
    } else if (gift.type === 'game') {
      return size/(135/15)
    } else if (gift.type === 'speaker') {
      return size/(299/136)
    } else if (gift.type === 'tablet') {
      return size/(247/6)
    } else if (gift.type === 'photo') {
      return size/(48/0.1)
    }

    return 1
  }

  getZPositionGift(gift: any): number {
    let z = this.getDepthGift(gift)/2+2

    for (let i = 0; this.inBox[i] !== gift.id && i < this.inBox.length; i++) {
      const g = this.getGiftById(this.inBox[i])

      if (gift.cell.x === g.cell.x && gift.cell.y === g.cell.y) {
        z += this.getDepthGift(g)
      }
    }

    return z
  }

  idBannedGiftsInCell(x: number, y: number): boolean {

    for (let i = 0; i < this.inBox.length; i++) {
      const g = this.getGiftById(this.inBox[i])

      if (g.cell.x === x && g.cell.y === y) {
        if (g.type === 'speaker') {
          return g.id
        }
      }
    }

    return false
  }

  getTopGiftFromCell(x: number, y: number): any {

    let topGift = null

    for (let i = 0; i < this.inBox.length; i++) {
      const g = this.getGiftById(this.inBox[i])

      if (g.cell.x === x && g.cell.y === y) {
        topGift = g
      }
    }

    return topGift
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

    if (this.transition) {
      // if (t.action === 'end' && !t.drag) {
      //   if (this.stage === 2) {
      //     this.setPosition2NoAnimate()
      //   } else if (this.stage === 3) {
      //     this.setPosition3NoAnimate()
      //   }
      // }
      return
    }

    if (this.stage === 0) {
      if (t.action === 'end' && !t.drag) {
        this.setPosition2()
      this.stage = 2
      }
    } else if (this.stage === 1) {
      if (this.tool === 'loupe' && t.action === 'start' && !this.wrap.disable) {
        this.initialWrap.scale = this.wrap.scale
      } else if (this.tool === 'move' && t.action === 'start' && !this.wrap.disable) {
        this.initialWrap.x = this.wrap.x
        this.initialWrap.y = this.wrap.y
      } else if (this.tool === 'loupe' && t.action === 'move' && !this.wrap.disable) {

        if (!this.showLoupeHint) this.showLoupeHint = true

        let k = 0.01

        let min = 0.5
        let max = 3

        let scale = -(t.y-t.start!.y)*k

        if (this.initialWrap.scale+scale < min) scale = min-this.initialWrap.scale
        if (this.initialWrap.scale+scale > max) scale = max-this.initialWrap.scale

        if (Math.abs(this.initialWrap.scale+scale-1) <= 0.1) scale = 1-this.initialWrap.scale

        scale = Math.round(scale*10)/10

        this.wrap.scale = this.initialWrap.scale+scale

      } else if (this.tool === 'move' && t.action === 'move' && !this.wrap.disable) {
        // let k = 0.01

        let limitX = this.draw.size.w*this.wrap.scale-(this.draw.size.w*this.wrap.scale-window.innerWidth)/2-20
        let limitY = this.draw.size.h*this.wrap.scale-(this.draw.size.h*this.wrap.scale-window.innerHeight)/2-20

        let x = t.x-t.start!.x
        let y = t.y-t.start!.y

        if (this.initialWrap.x+x < -limitX) x = -limitX-this.initialWrap.x
        if (this.initialWrap.x+x > limitX) x = limitX-this.initialWrap.x
        if (this.initialWrap.y+y < -limitY) y = -limitY-this.initialWrap.y
        if (this.initialWrap.y+y > limitY) y = limitY-this.initialWrap.y

        this.wrap.x = this.initialWrap.x+x
        this.wrap.y = this.initialWrap.y+y
      } else if (t.action === 'end') {
        this.showLoupeHint = false
      }
    } else if (this.stage === 2) {
      if (this.stats.mainGifts === 'open') {
        if (t.action === 'start') {

          let cellInfo = this.cellBoxDragging(t.x, t.y)
          let gift = this.getTopGiftFromCell(cellInfo.x, cellInfo.y)

          if (gift) {
            clearTimeout(this.dragGift.timeout)
            this.dragGift.timeout = setTimeout(() => {
              this.snapshotGiftService.get(gift).then((img: any) => {
                this.dragGift.animated = false
                this.dragGift.waiting = true

                this.hiddenGifts.set(gift.id, true)

                // this.inBox = this.inBox.filter(id => id !== gift.id)

                this.dragGift.id = gift.id
                this.dragGift.img = img
                this.dragGift.size.w = cellInfo.sizeCell.w
                this.dragGift.size.h = cellInfo.sizeCell.h
                this.dragGift.position.x = cellInfo.rectAllowed.x+cellInfo.x*cellInfo.sizeCell.w+cellInfo.sizeCell.w/2
                this.dragGift.position.y = cellInfo.rectAllowed.y+cellInfo.y*cellInfo.sizeCell.h+cellInfo.sizeCell.h/2

                this.onCloseScreen('mainGifts')
                this.showScreen('dragGift')

                this.setStartPositionDragGift(t.x, t.y)
                
              })
            }, 300)
          }
        }

        if (t.action === 'move') {
          clearTimeout(this.dragGift.timeout)
        }

        if (t.action === 'end') {
          clearTimeout(this.dragGift.timeout)
        }

        if (t.action === 'end' && !t.drag) {
          this.showAddGiftMenu()
        }

      } else if (this.stats.screenadd === 'open') {
        if (t.action === 'start') {
          clearTimeout(this.dragGift.timeout)
          const el = this.getEscalateDOM(t.target, 'giftlist-option')

          if (el) { 
            this.dragGift.timeout = setTimeout(() => {
              const icon = el.querySelector('.ico')
              const rectIcon = icon.getBoundingClientRect()
              const id = parseInt(el!.getAttribute('giftid'))
              const gift = this.gifts.find((g: any) => g.id === id)

              this.snapshotGiftService.get(gift).then((img: any) => {
                this.dragGift.id = id
                this.dragGift.img = img
                this.dragGift.size.w = rectIcon.width
                this.dragGift.size.h = rectIcon.height
                this.dragGift.position.x = rectIcon.x+this.dragGift.size.w/2
                this.dragGift.position.y = rectIcon.y+this.dragGift.size.h/2
                this.dragGift.waiting = true

                this.onCloseScreen('screenadd')
                this.showScreen('dragGift')

                this.setStartPositionDragGift(t.x, t.y)

              })
              
            }, 300)
          }

        }

        if (t.action === 'move') {
          clearTimeout(this.dragGift.timeout)
        }

        if (t.action === 'end') {
          clearTimeout(this.dragGift.timeout)
        }

        if (t.action === 'end' && t.drag === false) {
          const el1 = this.getEscalateDOM(t.target, 'button-back')
          const el2 = this.getEscalateDOM(t.target, 'button-forward')
          if (el1) {
            this.changeGlobalStage.emit(2)
          } else if (el2) {
            this.onCloseScreen('screenadd')
            this.setPosition3()
            this.stage++
          }
        }
        
      } else if (this.stats.dragGift === 'open') {
        if (t.action === 'move') {

          let cellInfo = this.cellBoxDragging(t.x, t.y)

          // this placecellBoxDragging

          this.cellInfoForBack = cellInfo

          console.log(this.cellInfoForBack)

          this.dragGift.allowed = cellInfo.allowed

          if (!cellInfo.allowed) {
            this.dragGift.animated = false
            this.dragGift.position.x = t.x
            this.dragGift.position.y = t.y
          } else {
            this.dragGift.animated = true
            this.dragGift.position.x = cellInfo.rectAllowed.x+cellInfo.x*cellInfo.sizeCell.w+cellInfo.sizeCell.w/2
            this.dragGift.position.y = cellInfo.rectAllowed.y+cellInfo.y*cellInfo.sizeCell.h+cellInfo.sizeCell.h/2
          }

        } else if (t.action === 'end') {
          if (true || !this.dragGift.waiting) {
            this.dragGift.waiting = false

            const cellInfo = this.cellBoxDragging(t.x, t.y)

            this.dragGift.allowed = cellInfo.allowed

            this.inBox = this.inBox.filter(id => id !== this.dragGift.id)

            if (!cellInfo.allowed) {

            } else {
              const gift = this.getGiftById(this.dragGift.id)
              gift.pos = { x: 0, y: 0 }
              gift.pos.x = -this.box.size.d/2+(0.5+cellInfo.x)*(this.box.size.d/this.grid.w)
              gift.pos.y = -this.box.size.w/2+(0.5+cellInfo.y)*(this.box.size.w/this.grid.h)
              gift.cell = { x: cellInfo.x, y: cellInfo.y }
              gift.pos.z = this.getZPositionGift(gift)
              this.inBox.push(this.dragGift.id)
            }
          }

          this.dragGift.id = null
          this.dragGift.img = null
          this.dragGift.position = { x: 0, y: 0 }
          this.dragGift.size = { w: 0, h: 0 }
          this.dragGift.animated = false
          this.onCloseScreen('dragGift')
          this.showScreen('mainGifts')
          this.hiddenGifts.clear()
          this.saveUpdate()
        }

      }
    } else if (this.stage === 3) {
      if (this.stats.mainPackage === 'open' && this.stats.screentrim === 'close' && this.stats.screenlisttrim === 'close') {
        if (t.action === 'start') {
          clearTimeout(this.dragGift.timeout)
          this.dragGift.timeout = setTimeout(() => {
            this.onCloseScreen('mainPackage')
            this.showScreen('chooseNext')
            setTimeout(() => {
              this.doscrolltocenterNextChoose = !this.doscrolltocenterNextChoose
            }, 0)
          }, 300)
        }

        if (t.action === 'move') {
          clearTimeout(this.dragGift.timeout)

          let dx = t.x-(t.start?.x || 0)
          let dy = t.y-(t.start?.y || 0)
          
          this.box.shiftRotate.x = -dy
          this.box.shiftRotate.y = dx
        }

        if (t.action === 'end') {
          clearTimeout(this.dragGift.timeout)
          
          this.box.rotate.x = (this.box.rotate.x+this.box.shiftRotate.x)%360
          this.box.rotate.y = (this.box.rotate.y+this.box.shiftRotate.y)%360
          this.box.shiftRotate.x = 0
          this.box.shiftRotate.y = 0
        }

        if (t.action === 'end' && !t.drag) {
          if (this.stats.chooseNext === 'close') {
            this.onCloseScreen('mainPackage')
            this.showScreen('screentrim')
            this.imgtrim = this.box.package
            this.ratiotrim = 100/100
            this.listtrim = 'wrapbox'
            this.disableds.menu = false
            this.menu = [{
              title: this.locationService.translate('trim', 'обрезать'),
              ico: '../../assets/scissors.svg',
              value: 'trim'
            }, {
              title: this.locationService.translate('change', 'изменить'),
              ico: '../../assets/image.svg',
              value: 'chgimage'
            }]
          }
        }
      } else if (this.stats.chooseNext === 'open') {
        if (t.action === 'end' && t.drag === false) {
          const el1 = this.getEscalateDOM(t.target, 'button-back')
          const el2 = this.getEscalateDOM(t.target, 'button-forward')
          if (el1) {
            this.onCloseScreen('chooseNext')
            this.setPositionFrom3To2()
            this.stage--
          } else if (el2) {
            this.onCloseScreen('chooseNext')
            this.setPosition4()
            this.stage++
          }
        }
      }
    } else if (this.stage === 4) {
      if (this.stats.mainTape === 'open' && this.stats.screentrim === 'close' && this.stats.screenlisttrim === 'close' && this.confirm.value === '') {
        if (t.action === 'start') {
          clearTimeout(this.dragGift.timeout)
          this.dragGift.timeout = setTimeout(() => {
            this.onCloseScreen('mainTape')
            this.showScreen('chooseNext')
            setTimeout(() => {
              this.doscrolltocenterNextChoose = !this.doscrolltocenterNextChoose
            }, 0)
          }, 300)
        }

        if (t.action === 'move') {
          clearTimeout(this.dragGift.timeout)

          let dx = t.x-(t.start?.x || 0)
          let dy = t.y-(t.start?.y || 0)
          
          this.box.shiftRotate.x = -dy
          this.box.shiftRotate.y = dx
        }

        if (t.action === 'end') {
          clearTimeout(this.dragGift.timeout)
          
          this.box.rotate.x = (this.box.rotate.x+this.box.shiftRotate.x)%360
          this.box.rotate.y = (this.box.rotate.y+this.box.shiftRotate.y)%360
          this.box.shiftRotate.x = 0
          this.box.shiftRotate.y = 0
        }

        if (t.action === 'end' && !t.drag) {
          if (this.stats.chooseNext === 'close') {
            this.onCloseScreen('mainTape')
            this.showScreen('screentrim')
            this.imgtrim = this.box.tape
            this.ratiotrim = 100/100
            this.listtrim = 'tapebox'
            this.disableds.menu = false
            this.menu = [{
              title: this.locationService.translate('trim', 'обрезать'),
              ico: '../../assets/scissors.svg',
              value: 'trim'
            }, {
              title: this.locationService.translate('change', 'изменить'),
              ico: '../../assets/image.svg',
              value: 'chgimage'
            }]
          }
        }
      } else if (this.stats.chooseNext === 'open') {
        if (t.action === 'end' && t.drag === false) {
          const el1 = this.getEscalateDOM(t.target, 'button-back')
          const el2 = this.getEscalateDOM(t.target, 'button-forward')
          if (el1) {
            this.onCloseScreen('chooseNext')
            this.setPositionFrom4To3()
            this.stage--
          } else if (el2) {
            this.onCloseScreen('chooseNext')
            this.changeGlobalStage.emit(4)
            // this.showConfirm('complete', this.locationService.translate('If you complete it, you will never be able to edit the gift again, you will have to delete it and create it again. Sure?', 'Если вы завершите, вы больше никогда не смжете отредактировать подарок, придётся удалять и заного создавать. Уверены?'))
            // setTimeout(() => {
            //     this.showConfirm('complete', this.locationService.translate('If you complete it, you will never be able to edit the gift again, you will have to delete it and create it again. Sure?', 'Если вы завершите, вы больше никогда не смжете отредактировать подарок, придётся удалять и заного создавать. Уверены?'))
            // }, 10)
          }
        }
      }
    }
  }

  showConfirm(type: string, text: string): void {
    this.confirm.value = text
    this.confirm.type = type
  }

  resultConfirm(res: any) {
    if (res === 'agree' && this.confirm.type === 'complete') {
      // this place
      // console.log('CREATE GIFT')
      // this.router.navigateByUrl('/i')
    }

    this.confirm.value = ''
    this.confirm.type = ''
  }

  closescreentrimlist(): void {
    this.onCloseScreen('screenlisttrim')
    this.showScreen('screentrim')
  }

  closeScreenChooseNext(): void {
    this.onCloseScreen('chooseNext')

    if (this.stage === 3) {
      this.showScreen('mainPackage')
    } else if (this.stage === 4) {
      this.showScreen('mainTape')
    }
  }

  onCloseScreenScreenAdd(): void {
    this.onCloseScreen('screenadd')
    if (this.stats.dragGift === 'close') {
      this.showScreen('mainGifts')
    }
  }

  closescreentrim(): void {
    this.onCloseScreen('screentrim')

    if (this.stage === 3) {
      this.showScreen('mainPackage')
    } else if (this.stage === 4) {
      this.showScreen('mainTape')
    }

    this.menu = []
    this.disableds.menu = true

    if (this.stats.screenlisttrim === 'close') {
      this.listtrim = ''
    }
  }

  closetrim(): void {
    this.menusublimeshow = !this.menusublimeshow
    this.changeDetectorRef.detectChanges()
  }

  setImageTrim(img: string): void {
    this.onCloseScreen('screenlisttrim')
    this.showScreen('screentrim')

    this.savetrim(img)
  }

  savetrim(img: string): void {
    this.imgtrim = img
    this.disableds.menu = false
    this.modetrim = 'usual'

    if (this.listtrim === 'wrapbox') {
      this.box.package = img
    } else if (this.listtrim === 'tapebox') {
      this.box.tape = img
    }

    this.saveUpdate()
  }

  actionmenu(act: string): void {
    this.stats.menu = act

    if (act === 'open') {
      if (this.stats.screentrim === 'open' && this.modetrim === 'trim') {
        this.disableds.menu = false
        this.disableds.screentrim = true
      }
    } else if (act === 'close') {
      if (this.stats.screentrim === 'open' && this.modetrim === 'trim') {
        this.disableds.menu = true
        this.disableds.screentrim = false
      }
    }
  }

  menuwaschoosen(val: string): void {
    if (val === 'back') {
      this.menu = [{
        title: this.locationService.translate('trim', 'обрезать'),
        ico: '../../assets/scissors.svg',
        value: 'trim'
      }, {
        title: this.locationService.translate('change image', 'изменить картинку'),
        ico: '../../assets/image.svg',
        value: 'chgimage'
      }]
    } else if (val === 'trim') {
      this.disableds.menu = true
      this.modetrim = 'trim'
      this.menu = [{
        title: this.locationService.translate('save', 'сохранить'),
        ico: '../../assets/checkmark.svg',
        value: 'save'
      }, {
        title: this.locationService.translate('cancel', 'отменить'),
        ico: '../../assets/cross.svg',
        value: 'cancel'
      }]
    } else if (val === 'save') {
      if (this.stats.screentrim === 'open') {
        if (this.hashedtrim !== null) this.hashedtrim = null;
        this.sublimesavetrim = !this.sublimesavetrim
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('change image', 'изменить картинку'),
          ico: '../../assets/image.svg',
          value: 'chgimage'
        }]
      }
    } else if (val === 'cancel') {
      if (this.stats.screentrim === 'open') {
        if (this.hashedtrim !== null) {
          this.imgtrim = this.hashedtrim
          this.hashedtrim = null
        }
        this.disableds.menu = false
        this.modetrim = 'usual'
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('change image', 'изменить картинку'),
          ico: '../../assets/image.svg',
          value: 'chgimage'
        }]
      }
    } else if (val === 'chgimage') {
      if (this.stats.screentrim === 'open') {
        this.onCloseScreen('screentrim')
        this.showScreen('screenlisttrim')
        // console.log(this.stats)
        // this.stats.screentrim = 'close'
        // this.stats.screenlisttrim = 'open'
        this.menu = []
      }
    }
  }

  inputUploadImageTrim(): void {
    this.host.nativeElement.querySelector("#inputuploadtrim").click()
  }

  async tryuploadimage(e: any): Promise<void> {
    const file = e.target.files[0]
    let error = []
    let img: any = {}
    if (file.size/(1024**2) > 3) {
      error.push('should be less than 3 MB')
    }
    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp' && file.type !== 'image/x-icon' && file.type !== 'image/gif') {
      error.push('should be type of png, jpeg, webp, gif, icon')
    }

    if (!error[0]) {
      img = await this.readFileService.getImageFromFile(file)
      if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
        error.push('should be less than 1920x1080')
      }
    }

    if (!error[0]) {
      this.uploadImageTrim(img.src)
    } else {
      this.showerror(error.join('; '))
      e.target.value = null
    }

    return new Promise(res => res())
  }

  async showerror(err: string): Promise<void> {
    clearTimeout(this.timeoutError)
    this.valerror = ''
    await this.asyncService.delay(250)
    this.valerror = err
    this.timeoutError = setTimeout(() => {
      this.valerror = ''
    }, 5000)
    return new Promise(res => res())
  }

  async uploadImageTrim(img: string): Promise<void> {
    this.hashedtrim = this.imgtrim
    this.imgtrim = img
    this.onCloseScreen('screenlisttrim')
    this.showScreen('screentrim')
    await this.asyncService.delay(300)
    this.disableds.menu = true
    this.modetrim = 'trim'
    this.menu = [{
      title: this.locationService.translate('save', 'сохранить'),
      ico: '../../assets/checkmark.svg',
      value: 'save'
    }, {
      title: this.locationService.translate('cancel', 'отменить'),
      ico: '../../assets/cross.svg',
      value: 'cancel'
    }]
    return new Promise(res => res())
  }

  cellBoxDragging(x: number, y: number): any {
    let allowed = false
    let [cellX, cellY] = [0, 0]

    let boxRect = { w: this.box.size.d*this.wrap.scale, h: this.box.size.w*this.wrap.scale, ratio: 0 }
    boxRect.ratio = boxRect.w/boxRect.h
    let screenRect = { w: window.innerWidth, h: window.innerHeight, ratio: 0 }
    screenRect.ratio = screenRect.w/screenRect.h

    let sizeCell = { w: boxRect.w/this.grid.w, h: boxRect.h/this.grid.h }

    let rectAllowed = { w: boxRect.w, h: boxRect.h, x: 0, y: 0 }

    if (boxRect.ratio >= screenRect.ratio) {
      rectAllowed.x = 0
      rectAllowed.y = (screenRect.h-boxRect.h)/2
    } else if (boxRect.ratio < screenRect.ratio) {
      rectAllowed.x = (screenRect.w-boxRect.w)/2
      rectAllowed.y = 0
    }

    cellX = Math.floor((x-rectAllowed.x)/(sizeCell.w))
    cellY = Math.floor((y-rectAllowed.y)/(sizeCell.h))

    if (x >= rectAllowed.x && x <= rectAllowed.x+rectAllowed.w) {
      if (y >= rectAllowed.y && y <= rectAllowed.y+rectAllowed.h) {
        const idBannedGiftsInCell = this.idBannedGiftsInCell(cellX, cellY)
        if (idBannedGiftsInCell === false || idBannedGiftsInCell === this.dragGift.id) {
          allowed = true
        }
      }
    }

    if (cellX < 0) cellX = 0
    if (cellX > this.grid.w-1) cellX = this.grid.w-1
    if (cellY < 0) cellY = 0
    if (cellY > this.grid.h-1) cellY = this.grid.h-1

    return { x: cellX, y: cellY, allowed, sizeCell, rectAllowed }
  }

  async setStartPositionDragGift(x: number, y: number): Promise<void> {

    let k = 0.9

    this.dragGift.animated = true

    await this.asyncService.delay(0)

    let cellInfo = this.cellBoxDragging(x, y)

    this.dragGift.allowed = cellInfo.allowed

    if (!cellInfo.allowed) {
      this.dragGift.animated = false
      this.dragGift.position.x = x
      this.dragGift.position.y = y
    } else {
      this.dragGift.animated = true
      this.dragGift.position.x = cellInfo.rectAllowed.x+cellInfo.x*cellInfo.sizeCell.w+cellInfo.sizeCell.w/2
      this.dragGift.position.y = cellInfo.rectAllowed.y+cellInfo.y*cellInfo.sizeCell.h+cellInfo.sizeCell.h/2
    }

    this.dragGift.size.w = cellInfo.sizeCell.w*k
    this.dragGift.size.h = cellInfo.sizeCell.h*k

    await this.asyncService.delay(300)

    // this.dragGift.animated = false
    this.dragGift.waiting = false

    return new Promise(res => res())
  }

  onOpenContext(): void {
    this.disableds.draw = true
    this.wrap.disable = true
  }

  onCloseContext(option: null | string): void {
    // console.log(option)

    this.wrap.disable = false

    if (option === 'pen') {
      this.disableds.draw = false
      this.toolDraw = 'pen'
      this.tool = 'pen'
    } else if (option === 'eraser') {
      this.disableds.draw = false
      this.toolDraw = 'eraser'
      this.tool = 'eraser'
    } else if (option === 'color') {
      this.colorDrawRef.nativeElement.click()
      this.disableds.draw = false
    } else if (option === 'move') {
      this.disableds.draw = true
      this.tool = 'move'
    } else if (option === 'loupe') {
      this.disableds.draw = true
      this.tool = 'loupe'
    } else if (option === 'next') {
      this.sublimeSaveDrawInside = !this.sublimeSaveDrawInside
    }

  }

  getNameTool(): string {

    if (this.tool === 'pen') {
      return this.locationService.translate('pen', 'карандаш')
    } else if (this.tool === 'move') {
      return this.locationService.translate('move', 'обзор')
    } else if (this.tool === 'eraser') {
      return this.locationService.translate('eraser', 'ластик')
    } else if (this.tool === 'loupe') {
      return this.locationService.translate('loupe', 'лупа')
    }

    return ``
  }

  getIconTool(): string {

    if (this.tool === 'pen') {
      return `../../assets/pen.svg`
    } else if (this.tool === 'move') {
      return `../../assets/resize.svg`
    } else if (this.tool === 'eraser') {
      return `../../assets/eraser.svg`
    } else if (this.tool === 'loupe') {
      return `../../assets/loupe-black.svg`
    }

    return ``
  }

  saveDrawInside(image: any): void {
    // if (this.stage !== 1) return

    let svg = this.linerSvgService.getSvg(this.draw.size.w, this.draw.size.h, image)

    let svgString = new XMLSerializer().serializeToString(svg);
    let decoded = unescape(encodeURIComponent(svgString));
    let base64 = btoa(decoded);
    let imgSource = `data:image/svg+xml;base64,${base64}`;

    let img = new Image()
    img.src = imgSource

    let canvas = document.createElement('canvas')
    let ctx = canvas!.getContext('2d')
    canvas.width = this.draw.size.w
    canvas.height = this.draw.size.h

    img.onload = () => {
      ctx!.save()
      ctx!.translate(this.draw.size.w/2, this.draw.size.h/2)
      ctx!.rotate(90*Math.PI/180)
      ctx!.drawImage(img, -this.draw.size.w/2, -this.draw.size.h/2)
      ctx!.restore()

      let png = canvas.toDataURL('image/png')
      this.box.inside = png
      
      this.setPosition2()
      this.stage++
    }
  }

  onCloseScreen(type: string): void {
    this.disableds[type] = true
    this.stats[type] = 'close'
  }

  showScreen(type: string): void {
    this.disableds[type] = false
    this.stats[type] = 'open'

    if (type === 'screenadd') {
      setTimeout(() => {
        this.doscrolltocenterAddGift = !this.doscrolltocenterAddGift
      }, 0)
    } else if (type === 'chooseWrap') {
      this.listtrim = 'wrapbox'
    }
  }

  setBoxSizeAndGrid(): void {
    const countGifts = this.gifts.length

    if (countGifts < 4) {
      this.grid = { w: 1, h: 1 }
      this.box.size.w = 150
      this.box.size.d = 150
    } else if (countGifts >= 4 && countGifts < 6) {
      this.grid = { w: 2, h: 2 }
      this.box.size.w = 300
      this.box.size.d = 300
    } else if (countGifts >= 6 && countGifts < 9) {
      this.grid = { w: 3, h: 2 }
      this.box.size.w = 300
      this.box.size.d = 450
    } else if (countGifts >= 9) {
      this.grid = { w: 3, h: 3 }
      this.box.size.w = 450
      this.box.size.d = 450
    }

    let maxHeight = 0

    this.gifts.forEach((gift: any) => {
      maxHeight += this.getDepthGift(gift)
    })

    maxHeight += 40

    maxHeight = Math.ceil(maxHeight)

    // if (maxHeight < 20) maxHeight = 20

    this.box.size.h = maxHeight
  }

  saveUpdate(): void {
    window.localStorage.setItem('box', JSON.stringify({
      package: this.box.package,
      tape: this.box.tape,
      grid: { w: this.grid.w, h: this.grid.h },
      size: { w: this.box.size.w, h: this.box.size.h, d: this.box.size.d },
      inBox: this.inBox
    }))

    window.localStorage.setItem('gifts', JSON.stringify(this.gifts))
  }

  ngOnInit(): void {

    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )

    // setTimeout(() => {
    //   this.setPosition4()
    //   this.stage = 4
    // }, 10)
    
    // window.localStorage.setItem('gifts', JSON.stringify([{"id":1,"title":"Игра","color":"#003791","front":"../../assets/game/example.jpg","inside":"../../assets/game/game.png","side":"../../assets/game/gameleft.png","code":"WERB-NBHP-DXCV-ZZKL-UIFM","platform":"ps","open":false,"type":"game"},{"id":3,"title":"Открытка","front":"../../assets/greetingcard/front/21.png","back":"../../assets/greetingcard/back/5.jpg","text":"Желаю счастья, радости, любви,\nЕще мечты заветной исполненья,\nЗдоровья крепкого, удач всегда во всем\nИ добрых слов не только в день рожденья!","sign":[],"color":"#ffffff","type":"greetingcard"},{"id":2,"title":"Аудиозапись","grill":"../../assets/speaker/grill/0.png","color":"#ff5722","value":[],"type":"speaker"}]))

    this.gifts = JSON.parse(window.localStorage.getItem('gifts') || '[]')

    this.setBoxSizeAndGrid()
    
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

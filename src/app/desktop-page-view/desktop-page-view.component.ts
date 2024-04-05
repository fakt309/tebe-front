import { Component, OnInit, EventEmitter, HostListener, ViewContainerRef, ViewChild, ElementRef } from '@angular/core'
import { LocationService } from '../services/location.service'
import { ConfirmService } from '../services/confirm.service'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'
import { AsyncService } from '../async.service'
import { Router } from '@angular/router'
import { BackendService } from '../services/backend.service'

@Component({
  selector: 'app-desktop-page-view',
  templateUrl: './desktop-page-view.component.html',
  styleUrls: ['./desktop-page-view.component.scss'],
   animations: [
    trigger('verticalShow', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ transform: 'translateY(-100%)' }))
      ])
    ]),
    trigger('mainText', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: '0' }),
        animate('0.2s {{delay}} ease', style({ transform: 'scale(1)', opacity: '1' }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: '1' }),
        animate('0.2s {{delay}} ease', style({ transform: 'scale(0)', opacity: '0' }))
      ])
    ]),
    trigger('viewGiftDisplay', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.2s ease', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.2s ease', style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('topToBottom', [
      transition(':enter', [
        style({ transform: 'translateY(-100vh)' }),
        animate('0.2s ease', style({ transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0px)' }),
        animate('0.2s ease', style({ transform: 'translateY(-100vh)' }))
      ])
    ]),
    trigger('optionGift', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: '0' }),
        animate('0.2s ease', style({ transform: 'translateY(0%)', opacity: '1' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)', opacity: '1' }),
        animate('0.2s ease', style({ transform: 'translateY(100%)', opacity: '0' }))
      ])
    ]),
    trigger('bottomPanel', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.2s ease', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('0.2s ease', style({ transform: 'translateY(100%)' }))
      ])
    ]),
    trigger('activeBack', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('0.2s ease', style({ opacity: '1' }))
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('0.2s ease', style({ opacity: '0' }))
      ])
    ]),
    trigger('optionViewGift', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: '0' }),
        animate('0.2s ease', style({ transform: 'scale(1)', opacity: '1' }))
      ])
    ])
  ]
})
export class DesktopPageViewComponent implements OnInit {

  @ViewChild('boxRef', { read: ElementRef }) boxRef!: ElementRef

  inBox: Array<any> = []

  gifts: Array<any> = []

  wrap: any = {
    x: 0,
    y: 0,
    scale: 1,
    disable: false,
    animated: false,
    shift: { x: 0, y: 0 },
    show: false
  }

  rotateGift: any = {
    angle: 0,
    pause: false,
    interval: setInterval(() => {}, 9999),
    animate: false,
    startMouse: 0,
    startRotate: 0
  }

  box: any = {
    animate: false,
    packed: true,
    wrapped: true,
    tapped: true,
    package: '../../assets/box/package/4.jpg',
    tape: '../../assets/box/tape/1.jpg',
    coord: { x: 0, y: -1000, z: 0 },
    rotate: { x: -15, y: -70, z: 0 },
    size: { w: 110, h: 130, d: 120 },
    scale: 1,
    shiftRotate: { x: 0, y: 0 }
  }

  grid: any = { w: 2, h: 2 }

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

  // code: string = '1000'
  disabledCode: boolean = false
  toRejectCode: EventEmitter<void> = new EventEmitter<void>()
  toAcceptCode: EventEmitter<void> = new EventEmitter<void>()
  toInputCode: EventEmitter<void> = new EventEmitter<void>()

  general: any = {}

  triesCode: number = 0

  stage: number = 0

  dialogShow: boolean = false

  showArchive: boolean = false

  activeGift: any = {
    id: null,
    animated: false
  }

  activeGiftView: any = {}

  mouse: any = {
    down: false,
    start: { x: 0, y: 0 }
  }

  webcamVideo: any = {
    visible: false,
    recording: false,
    screen: 'watching',//recording watching
    showConfirm: 'close',
    sublimeUninit: false
  }

  transition: boolean = false

  firstMove: boolean = false

  public textError: string = ''
  public timeoutError: any = setTimeout(() => {}, 0)

  @ViewChild('lockRef', { read: ElementRef }) lockRef!: ElementRef

  constructor(
    public locationService: LocationService,
    private confirmService: ConfirmService,
    private hostContainer: ViewContainerRef,
    private asyncService: AsyncService,
    private router: Router,
    private backendService: BackendService
  ) { }

  @HostListener('window:mousedown', ['$event']) onMouseDown(e: any): void {
    if (this.transition) return

    this.mouse.down = true

    let [x, y] = [e.clientX, e.clientY]
    const target = e.target

    this.mouse.start = { x, y }

    if (this.stage === 3 && this.activeGift.id === null) {
      document.body.style.userSelect = 'none'

      clearTimeout(this.dragGift.timeout)

      let cellInfo = this.cellBoxDragging(x, y)
      let gift = this.getTopGiftFromCell(cellInfo.x, cellInfo.y)

      if (gift) {

        if (cellInfo.allowed) {
          this.setActiveGift(gift)
        }
      }
    } else if (this.stage === 3 && this.activeGift.id) {
      document.body.style.userSelect = 'none'
      this.activeGift.animated = false
    }

  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: any): void {
    this.mouse.down = false

    let [x, y] = [e.clientX, e.clientY]

    if (this.stage === 3 && this.activeGift.id) {
      
      document.body.style.userSelect = 'auto'

      const gift = this.getGiftById(this.activeGift.id)

      if (gift) {
          gift.rotate.x = (gift.rotate.x+gift.shiftRotate.x)%360
          gift.shiftRotate.x = 0
      }

      setTimeout(() => {
        this.activeGift.animated = true
      }, 10)

    } else if (this.stage === 4) {
      if (this.rotateGift.pause) clearInterval(this.rotateGift.interval)
      this.rotateGift.pause = false
      this.rotateGift.startMouse = 0
      this.rotateGift.startRotate = 0
      document.body.style.userSelect = 'auto'
    }

  }

  @HostListener('window:mouseleave', ['$event']) onMouseLeave(): void {
    if (this.stage === 4) {
      this.rotateGift.pause = false
      this.rotateGift.startMouse = 0
      this.rotateGift.startRotate = 0
      document.body.style.userSelect = 'auto'
    }
  }

  @HostListener('window:mousemove', ['$event']) onMouseMove(e: any): void {
    if (!this.mouse.down) return

    let [x, y] = [e.clientX, e.clientY]

    if (this.stage === 3 && this.activeGift.id) {
      const gift = this.getGiftById(this.activeGift.id)

      if (gift) {

        let dx = x-(this.mouse.start.x || 0)
        let dy = y-(this.mouse.start.y || 0)
        
        gift.shiftRotate.x = -dx
        // gift.shiftRotate.y = dx
      }

    } else if (this.stage === 4) {
      if (!this.rotateGift.pause) return
      this.rotateGift.angle = this.rotateGift.startRotate+(e.clientX-this.rotateGift.startMouse)
      if (this.rotateGift.angle > 360) this.rotateGift.angle -= 360
      if (this.rotateGift.angle < 0) this.rotateGift.angle += 360
    }

  }

  @HostListener('window:click') onClick(): void {
    if (this.stage === 1) {
      this.setStage2()
    }
  }

  mouseDownIcon(e: any): void {
    this.rotateGift.pause = true
    this.rotateGift.startMouse = e.clientX
    this.rotateGift.startRotate = this.rotateGift.angle
    document.body.style.userSelect = 'none'
  }

  startRotate(): void {
    let speed = 1
    clearInterval(this.rotateGift.interval)
    this.rotateGift.interval = setInterval(() => {
      if (!this.rotateGift.pause) {
        this.rotateGift.angle += speed
        if (this.rotateGift.angle > 360) this.rotateGift.angle -= 360
        if (this.rotateGift.angle < 0) this.rotateGift.angle += 360
      }
    }, 10)
  }

  getValuePostfix(value: string): string {
    if (value === 'dollar') {
      return '$'
    } else if (value === 'euro') {
      return '€'
    } else if (value === 'ruble') {
      return '₽'
    } else if (value === 'yen') {
      return '¥'
    } else if (value === 'pound') {
      return '£'
    }

    return value.slice(0, 1)
  }

  getPriceString(): string {

    if (this.box.cost_type === 'yes') {
      return `${this.box.cost_price} ${this.getValuePostfix(this.box.cost_currency)}`
    } else if (this.box.cost_type === 'no') {
      return this.locationService.translate('not specified', 'не указано')
    } else if (this.box.cost_type === 'hint') {
      let from = this.box.cost_price[0]
      let to = this.box.cost_price[1]
      if (to === 0 && from === to) {
        return `0 ${this.getValuePostfix(this.box.cost_currency)}`
      } else if (to === 'infinity') {
        return `${this.locationService.translate('more', 'более')} ${from} ${this.getValuePostfix(this.box.cost_currency)}`
      }
      return `${this.locationService.translate('from', 'от')} ${from} ${this.locationService.translate('to', 'до')} ${to} ${this.getValuePostfix(this.box.cost_currency)}`
    }

    return ''
  }

  async stopRotate(): Promise<void> {
    this.rotateGift.animate = true
    await this.asyncService.delay(10)
    clearInterval(this.rotateGift.interval)
    if (this.rotateGift.angle < 180) {
      this.rotateGift.angle = 0
    } else {
      this.rotateGift.angle = 360
    }
    await this.asyncService.delay(200)
    this.rotateGift.animate = false
    return new Promise(res => res())
  }

  async setStage1(): Promise<void> {

    this.transition = true

    this.stage = 0

    await this.asyncService.delay(300)

    this.stage = 1

    this.transition = false

    return new Promise(res => res())
  }

  async setStage2(): Promise<void> {

    this.transition = true

    this.stage = 0

    await this.asyncService.delay(400)

    this.stage = 2

    this.transition = false

    return new Promise(res => res())
  }

  async setStage3NoAnimation(): Promise<void> {

    this.stage = 0

    this.wrap.show = true

    this.box.animate = false
    this.wrap.animated = false

    this.box.tapped = false
    this.box.wrapped = false
    this.box.packed = false

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    this.showArchive = true

    this.stage = 3

    this.transition = false

    return new Promise(res => res())
  }

  async setStage3(): Promise<void> {

    this.transition = true

    this.toAcceptCode.emit()

    await this.asyncService.delay(400)

    this.stage = 0

    this.wrap.show = true
    // this.box.coord.y = -1000

    await this.asyncService.delay(10)

    this.box.animate = true
    this.wrap.animated = true

    await this.asyncService.delay(1000)

    this.box.coord.y = 0

    await this.asyncService.delay(300)

    this.box.tapped = false

    await this.asyncService.delay(4000)

    this.box.wrapped = false

    await this.asyncService.delay(6000)

    this.box.packed = false

    await this.asyncService.delay(2000)

    // this.wrap.scale = this.getScaleBoxToFitScreen()

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    await this.asyncService.delay(300)

    this.showArchive = true

    await this.asyncService.delay(300)

    this.stage = 3

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())
  }

  async setStage4NoAnimation(): Promise<void> {

    this.showArchive = true
    this.wrap.animated = false
    this.box.animate = false

    this.box.coord.y = -window.innerHeight

    this.wrap.show = false

    this.transition = false

    this.stage = 4

    // this.setActiveGiftView(this.gifts[0].id)

    this.showGeneralInfo()

    return new Promise(res => res())
  }

  async setStage4(): Promise<void> {
    this.transition = true

    await this.asyncService.delay(10)

    this.box.coord.y = -window.innerHeight

    await this.asyncService.delay(300)

    this.stage = 0

    this.wrap.show = false

    this.transition = false

    this.stage = 4

    // this.setActiveGiftView(this.gifts[0].id)

    this.showGeneralInfo()

    return new Promise(res => res())
  }

  showGeneralInfo(): void {
    this.activeGiftView = null
  }

  setActiveGiftView(id: number): void {
    this.activeGiftView = this.gifts.find(x => x.id === id)

    this.rotateGift.angle = 0
    this.startRotate()
  }

  showDialog(): void {
    this.dialogShow = true
  }

  onCloseDialog(): void {
    this.dialogShow = false
  }

  showWebcamVideo(): void {

    this.webcamVideo.visible = true

  }

  async closeWebcamVideo(): Promise<void> {
    this.webcamVideo.screen = 'watching'
    this.webcamVideo.visible = false
    return new Promise(res => res())
  }

  getTopGiftFromCell(x: number, y: number): any {

    // let topGift = null

    // for (let i = 0; i < this.inBox.length; i++) {
    //   const g = this.getGiftById(this.inBox[i])

    //   if (g.cell.x === x && g.cell.y === y) {
    //     topGift = g
    //   }
    // }

    // return topGift

    let maxZ = -999999

    let topGift = null

    for (let i = 0; i < this.inBox.length; i++) {
      const g = this.getGiftById(this.inBox[i])

      if (g.cell.x === x && g.cell.y === y) {

        if (g.pos.z > maxZ) {
          maxZ = g.pos.z
          topGift = g
        }
        
      }
    }

    return topGift
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

  cellBoxDragging(x: number, y: number): any {
    if (!this.boxRef) return

    let allowed = false
    let [cellX, cellY] = [0, 0]

    let boxRect = { w: this.box.size.d*this.wrap.scale, h: this.box.size.w*this.wrap.scale, ratio: 0 }
    boxRect.ratio = boxRect.w/boxRect.h
    let screenRect = { w: window.innerWidth, h: window.innerHeight, ratio: 0 }
    screenRect.ratio = screenRect.w/screenRect.h

    let sizeCell = { w: boxRect.w/this.grid.w, h: boxRect.h/this.grid.h }

    let rectAllowed = { w: boxRect.w, h: boxRect.h, x: 0, y: 0 }

    let boundingRect = this.boxRef.nativeElement.getBoundingClientRect()

    rectAllowed.x = boundingRect.x-boxRect.w/2
    rectAllowed.y = boundingRect.y-boxRect.h/2

    cellX = Math.floor((x-rectAllowed.x)/(sizeCell.w))
    cellY = Math.floor((y-rectAllowed.y)/(sizeCell.h))

    if (x >= rectAllowed.x && x <= rectAllowed.x+rectAllowed.w) {
      if (y >= rectAllowed.y && y <= rectAllowed.y+rectAllowed.h) {
        // const idBannedGiftsInCell = this.idBannedGiftsInCell(cellX, cellY)
        // if (idBannedGiftsInCell === false || idBannedGiftsInCell === this.dragGift.id) {
          allowed = true
        // }
      }
    }

    if (cellX < 0) cellX = 0
    if (cellX > this.grid.w-1) cellX = this.grid.w-1
    if (cellY < 0) cellY = 0
    if (cellY > this.grid.h-1) cellY = this.grid.h-1

    return { x: cellX, y: cellY, allowed, sizeCell, rectAllowed }
  }

  getSizeGift(gift: any): number {
    let k = 0.9;

    if (gift.id === this.activeGift.id) {
      return this.getSizeActiveGift(gift)
    }

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

  isGiftInBox(gift: any): boolean {
    return this.inBox.find(x => x === gift.id) ? true : false
  }

  async setActiveGift(gift: any): Promise<void> {
    this.activeGift.animated = true

    const widthSidebar =  window.innerWidth*0.4 < 500 ? 500 : window.innerWidth*0.4 

    const allowedRect = { w: window.innerWidth-widthSidebar, h: window.innerHeight }
    const ratioAllowedRect = allowedRect.w/allowedRect.h

    await this.asyncService.delay(10)

    this.activeGift.id = gift.id

    gift.pos.x = 0
    gift.pos.y = 0
    gift.pos.z = 999*this.box.size.h

    await this.asyncService.delay(400)

    this.activeGift.animated = false

    return new Promise(res => res())
  }

  getTypeActiveGift(): string {
    const gift = this.getGiftById(this.activeGift.id)

    return gift.type
  }

  getTextGreetingCard(gift: any): string {
    return gift.text.replace(/\n/g, '<br/>')
  }

  async openGameGift(): Promise<void> {
    const gift = this.getGiftById(this.activeGift.id)

    this.activeGift.animated = true

    await this.asyncService.delay(10)

    gift.open = !gift.open

    await this.asyncService.delay(300)

    this.activeGift.animated = false

    return new Promise(res => res())
  }

  async openGameGiftView(): Promise<void> {
    const gift = this.activeGiftView

    this.rotateGift.animate = true

    await this.asyncService.delay(10)

    this.rotateGift.pause = true
    this.rotateGift.angle = 0

    gift.open = !gift.open

    await this.asyncService.delay(300)

    this.rotateGift.animate = false

    return new Promise(res => res())
  }


  async showError(text: string): Promise<void> {
    clearTimeout(this.timeoutError)
    this.textError = ''
    await this.asyncService.delay(100)
    this.textError = text
    this.timeoutError = setTimeout(() => {
      this.textError = ''
    }, 5000)
    return new Promise(res => res())
  }

  copyCodeGiftView(): void {
    navigator.clipboard.writeText(`${this.activeGiftView.code}`).then(
      () => {
        this.showError(this.locationService.translate('code copied', 'код скопирован'))
      },
      (err) => {
        
      }
    )
  }

  async putActiveGiftToArchive(): Promise<void> {

    const gift = this.getGiftById(this.activeGift.id)
    const widthSidebar =  window.innerWidth*0.4 < 500 ? 500 : window.innerWidth*0.4 

    this.activeGift.animated = true

    await this.asyncService.delay(10)

    gift.pos.x = window.innerWidth/2

    await this.asyncService.delay(300)

    this.inBox = this.inBox.filter((x: number) => x !== this.activeGift.id)

    this.activeGift.id = null

    this.activeGift.animated = false

    if (this.inBox.length === 0) {
      this.setStage4()
    }

    return new Promise(res => res())
  }

  getSizeActiveGift(gift: any): number {
    let k = 0.6

    const widthSidebar =  window.innerWidth*0.4 < 500 ? 500 : window.innerWidth*0.4 

    const allowedRect = { w: window.innerWidth-widthSidebar, h: window.innerHeight }
    const ratioAllowedRect = allowedRect.w/allowedRect.h

    // let minY = -((window.innerHeight/4)/this.wrap.scale)-this.wrap.y/this.wrap.scale
    // let maxY = -this.wrap.y/this.wrap.scale

    let minX = ((window.innerWidth/4)/this.wrap.scale)-this.wrap.x/this.wrap.scale
    let maxX = -this.wrap.y/this.wrap.scale

    let x = gift.pos.x


    //*(((y-minY)/(maxY-minY))/2+0.5)
    if (gift.type === 'greetingcard') {
      if (ratioAllowedRect >= (297/420)) {
        return allowedRect.h/this.wrap.scale*(297/420)*k*(((x-minX)/(maxX-minX))/2+0.5)
      } else if (ratioAllowedRect <= (297/420)) {
        return allowedRect.w/this.wrap.scale*k*(((x-minX)/(maxX-minX))/2+0.5)
      }
      return allowedRect.h/this.wrap.scale*(297/420)*k*(((x-minX)/(maxX-minX))/2+0.5)
    } else if (gift.type === 'game') {
      if (ratioAllowedRect >= (135/190)) {
        return allowedRect.h/this.wrap.scale*(135/190)*k*(((x-minX)/(maxX-minX))/2+0.5)
      } else if (ratioAllowedRect <= (135/190)) {
        return allowedRect.w/this.wrap.scale*k*(((x-minX)/(maxX-minX))/2+0.5)
      }
      return allowedRect.h/this.wrap.scale*(135/190)*k*(((x-minX)/(maxX-minX))/2+0.5)
    } else if (gift.type === 'speaker') {
      if (ratioAllowedRect >= (299/136)) {
        return allowedRect.h/this.wrap.scale*(299/136)*k*(((x-minX)/(maxX-minX))/2+0.5)
      } else if (ratioAllowedRect <= (299/136)) {
        return allowedRect.w/this.wrap.scale*k*(((x-minX)/(maxX-minX))/2+0.5)
      }
      return allowedRect.h/this.wrap.scale*(299/136)*k*(((x-minX)/(maxX-minX))/2+0.5)
    } else if (gift.type === 'tablet') {
      if (ratioAllowedRect >= (247/178)) {
        return allowedRect.h/this.wrap.scale*(247/178)*k*(((x-minX)/(maxX-minX))/2+0.5)
      } else if (ratioAllowedRect <= (247/178)) {
        return allowedRect.w/this.wrap.scale*k*(((x-minX)/(maxX-minX))/2+0.5)
      }
      return allowedRect.h/this.wrap.scale*(247/178)*k*(((x-minX)/(maxX-minX))/2+0.5)
    } else if (gift.type === 'photo') {
      if (ratioAllowedRect >= (48/64)) {
        return allowedRect.h/this.wrap.scale*(48/64)*k*(((x-minX)/(maxX-minX))/2+0.5)
      } else if (ratioAllowedRect <= (48/64)) {
        return allowedRect.w/this.wrap.scale*k*(((x-minX)/(maxX-minX))/2+0.5)
      }
      return allowedRect.h/this.wrap.scale*(48/64)*k*(((x-minX)/(maxX-minX))/2+0.5)
    }

    return 0
  }

  getSizeBackActive(): { w: number, h: number } {
    return {
      w: 3*window.innerWidth*this.wrap.scale,
      h: 3*window.innerHeight*this.wrap.scale
    }
  }

  getGiftById(id: number): any {
    return this.gifts.find(x => x.id === id) || null
  }

  async checkCode(code: string): Promise<void> {
    this.disabledCode = true

    let response = await this.backendService.getBox(this.general.id, code)

    if (!response.success) {
      this.toRejectCode.emit()
      this.triesCode--
    } else {

      const box = response.result.box
      const gifts = response.result.gifts

      this.box = {
        ...this.box,
        id: box.id,
        package: `${this.backendService.getLinkFromBackend(box.link_package)}`,
        tape: `${this.backendService.getLinkFromBackend(box.link_tape)}`,
        cost_currency: box.cost_currency,
        cost_price: box.cost_price,
        cost_rate: box.cost_rate,
        cost_type: box.cost_type
      }

      // this.gifts = gifts

      this.setGifts(gifts)

      // this place

      this.setStage3()
    }

    this.disabledCode = false

    // console.log(response)

    // if (code === '1000') {
    //   this.setStage3()
    // } else {
    //   this.toRejectCode.emit()
    //   this.triesCode--
    // }
  }

  onInputLock(code: string): void {
    if (this.triesCode <= 0) return

    if (this.triesCode === 1) {
      const el = this.lockRef.nativeElement

      this.disabledCode = true

      this.confirmService.show(
        this.hostContainer,
        el,
        this.locationService.translate('Last try. Then the gift is blocked. You will have to ask the sender to unblock it.', 'Последняя попытка. Дальше подарок блокируется. Придётся просить отправителя, чтобы он разблокировал.'),
        (res: boolean): void => {
          this.disabledCode = false
          this.confirmService.hide()
          if (res) {
            setTimeout(() => {
              this.checkCode(code)
            }, 10)
          }
        }
      )
      return
    }

    this.checkCode(code)
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

  setGiftInBox(): void {
    this.inBox = this.gifts.map(x => x.id)
  }

  convertURIToBinary(dataURI: any): any {
    let BASE64_MARKER = ';base64,'
    let base64Index = dataURI.indexOf(BASE64_MARKER)+BASE64_MARKER.length
    let base64 = dataURI.substring(base64Index)
    let raw = window.atob(base64)
    let rawLength = raw.length
    let arr = new Uint8Array(new ArrayBuffer(rawLength))

    for (let i = 0; i < rawLength; i++) {
      arr[i] = raw.charCodeAt(i)
    }
    return arr
  }

  async refreshAudioInGifts(gifts: Array<any>): Promise<Array<any>> {
    // const gifts = [...this.gifts]

    for (let i = 0; i < gifts.length; i++) {

      let gift = gifts[i]

      if (gift.type === 'speaker') {

        const blob = (await (await fetch(gift.value)).blob())
        gifts[i] = { ...gift, value: [blob] }

        //   .then(res => res.blob())
        //   .then(blob => {
        //     // console.log(res)

        //     gifts[i] = { ...gift, value: [blob] }
        //     // // Here's where you get access to the blob
        //     // // And you can use it for whatever you want
        //     // // Like calling ref().put(blob)

        //     // // Here, I use it to make an image appear on the page
        //     // let objectURL = URL.createObjectURL(blob);
        //     // let myImage = new Image();
        //     // myImage.src = objectURL;
        //     // document.getElementById('myImg').appendChild(myImage)
        // })

        // const value = await this.convertURIToBinary(gift.value)

        // let blob = new Blob([value], {
        //   type: 'audio/webm' // ;codecs=opus
        // })

        // gifts[i] = { ...gift, value: [blob] }

        continue
      }

      gifts[i] = { ...gift }
    }

    // this.gifts = gifts

    // console.log(this.gifts)

    return new Promise(res => res(gifts))
  }

  async refreshVideoInGifts(gifts: Array<any>): Promise<Array<any>> {

    for (let i = 0; i < gifts.length; i++) {

      let gift = gifts[i]

      if (gift.type === 'tablet') {

        const blob = (await (await fetch(gift.value)).blob())

        gifts[i] = { ...gift, value: [blob], urlVideo: URL.createObjectURL(blob) }

        // const value = await this.convertURIToBinary(gift.value)

        // let blob = new Blob([value], {
        //   type: 'video/webm' // ;codecs=vp8,opus;
        // })

        // gifts[i] = { ...gift, value: [blob], urlVideo: URL.createObjectURL(blob) }

        continue
      }

      gifts[i] = { ...gift }
    }

    return new Promise(res => res(gifts))
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

  async setGifts(gifts: Array<any>): Promise<void> {

    // let gifts = JSON.parse(window.localStorage.getItem('gifts') || '[]')

    // let gifts = this.gifts

    gifts.forEach(g => {
      if (g.type === 'greetingcard') {
        g.back = this.backendService.getLinkFromBackend(g.back)
        g.front = this.backendService.getLinkFromBackend(g.front)
      } else if (g.type === 'game') {
        g.front = this.backendService.getLinkFromBackend(g.front)
        g.inside = this.backendService.getLinkFromBackend(g.inside)
        g.side = this.backendService.getLinkFromBackend(g.side)
      } else if (g.type === 'speaker') {
        g.grill = this.backendService.getLinkFromBackend(g.grill)
        g.value = this.backendService.getLinkFromBackend(g.value)
      } else if (g.type === 'tablet') {
        g.value = this.backendService.getLinkFromBackend(g.value)
      } else if (g.type === 'photo') {
        g.photo = this.backendService.getLinkFromBackend(g.photo)
      }
      
    })

    gifts = await this.refreshAudioInGifts(gifts)
    gifts = await this.refreshVideoInGifts(gifts)

    this.gifts = gifts

    this.setGiftInBox()
    this.setBoxSizeAndGrid()

    this.gifts = this.gifts.map(g => ({
      ...g,
      pos: {
        x: -this.box.size.d/2+(0.5+g.cell.x)*(this.box.size.d/this.grid.w),
        y: -this.box.size.w/2+(0.5+g.cell.y)*(this.box.size.w/this.grid.h),
        z: this.getZPositionGift(g)
      },
      rotate: { x: 0, y: 0, z: 0 },
      shiftRotate: { x: 0, y: 0, z: 0 }
    }))

    return new Promise(res => res())
  }

  getBoxGeneral(): void {
    const path = decodeURI(this.router.url)
    const link = path.split('?')[0].split('/')[2]

    console.log(link)

    this.backendService.getBoxGeneralByLink(link).then((response: any) => {

      if (!response.success || !response.result) return

      this.triesCode = response.result.attempts

      this.general.id = response.result.id

    })
  }

  ngOnInit(): void {

    this.getBoxGeneral()

    // this.box.coord.y = -window.innerHeight

    // this.setGifts().then(() => {
    //   // this.inBox = []
    //   // this.activeGift.id = null
    //   // this.setStage4NoAnimation()
    // })
    // this.box = { ...this.box, ...JSON.parse(window.localStorage.getItem('box') || '{}') }

    this.setStage1()
    // this.setStage3NoAnimation()
    

  }

}

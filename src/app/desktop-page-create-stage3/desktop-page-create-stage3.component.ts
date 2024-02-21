import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core'
import { trigger, state, transition, style, animate } from '@angular/animations'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'
import { SnapshotGiftService } from '../snapshot-gift.service'
import { LocationService } from '../services/location.service'
import { ReadFileService } from '../services/read-file.service'

@Component({
  selector: 'app-desktop-page-create-stage3',
  templateUrl: './desktop-page-create-stage3.component.html',
  styleUrls: ['./desktop-page-create-stage3.component.scss'],
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
    trigger('popup', [
      state('open', style({
        display: 'flex',
        transform: 'translateX(70px) translateY(-60px)',
        opacity: '1'
      })),
      state('close', style({
        transform: 'translateX(70px) translateY(-80px)',
        opacity: '0',
        display: 'none'
      })),
      transition('open <=> close', animate('0.2s ease'))
    ])
  ]
})
export class DesktopPageCreateStage3Component implements OnInit {

  @ViewChild('boxRef', { read: ElementRef }) boxRef!: ElementRef

  gifts: Array<any> = []

  subs: Array<Subscription> = []

  grid: any = { w: 2, h: 2 }

  inBox: Array<any> = []
  hiddenGifts: Map<number, boolean> = new Map()

  textError: string = ''
  timeoutError = setTimeout(() => {}, 0)

  transition: boolean = false

  box: any = {
    animate: false,
    packed: false,
    wrapped: false,
    tapped: false,
    package: '../../assets/box/package/4.jpg',
    tape: '../../assets/box/tape/1.jpg',
    coord: { x: 0, y: -1000, z: 0 },
    rotate: { x: -15, y: 110, z: 0 },
    size: { w: 110, h: 130, d: 120 },
    scale: 1,
    shiftRotate: { x: 0, y: 0 }
  }

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

  stage: number = 0

  showGifts: boolean = false
  showWrap: boolean = false
  showTape: boolean = false

  imageUpload: any = {
    visible: false,
    type: 'none',
    img: '',
    cancelImg: '',
    ratio: 16/9,
    mode: 'usual',
    sublimesave: false,
    showList: false
  }

  mouse: any = {
    down: false,
    start: { x: 0, y: 0 }
  }

  isRotateGift: boolean = false

  constructor(
    public asyncService: AsyncService,
    public snapshotGiftService: SnapshotGiftService,
    public locationService: LocationService,
    public readFileService: ReadFileService
  ) { }

  @HostListener('window:mousedown', ['$event']) onMouseDown(e: any): void {
    if (this.transition) return

    this.mouse.down = true

    let [x, y] = [e.clientX, e.clientY]
    const target = e.target

    this.mouse.start = { x, y }

    if (this.stage === 1) {
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'

      clearTimeout(this.dragGift.timeout)
      const elGift = this.getEscalateDOM(target, 'gift-option')
      const elIcon = this.getEscalateDOM(target, 'icon')

      let cellInfo = this.cellBoxDragging(x, y)
      let gift = this.getTopGiftFromCell(cellInfo.x, cellInfo.y)

      if (elGift && elIcon) {
        const rectIcon = elIcon.getBoundingClientRect()
        const id = parseInt(elGift!.getAttribute('giftid'))
        const gift = this.gifts.find((g: any) => g.id === id)

        this.snapshotGiftService.get(gift).then((img: any) => {
          this.dragGift.id = id
          this.dragGift.img = img
          this.dragGift.size.w = rectIcon.width
          this.dragGift.size.h = rectIcon.height
          this.dragGift.position.x = rectIcon.x+this.dragGift.size.w/2
          this.dragGift.position.y = rectIcon.y+this.dragGift.size.h/2
          this.dragGift.waiting = true

          this.setStartPositionDragGift(x, y)

        })
      } else if (gift) {
        if (x < cellInfo.rectAllowed.x || x > cellInfo.rectAllowed.x+cellInfo.rectAllowed.w || y < cellInfo.rectAllowed.y || y > cellInfo.rectAllowed.y+cellInfo.rectAllowed.h) {
          return
        }
        this.snapshotGiftService.get(gift).then((img: any) => {
          this.dragGift.animated = false
          this.dragGift.waiting = true

          this.hiddenGifts.set(gift.id, true)

          this.dragGift.id = gift.id
          this.dragGift.img = img
          this.dragGift.size.w = cellInfo.sizeCell.w
          this.dragGift.size.h = cellInfo.sizeCell.h
          this.dragGift.position.x = cellInfo.rectAllowed.x+cellInfo.x*cellInfo.sizeCell.w+cellInfo.sizeCell.w/2
          this.dragGift.position.y = cellInfo.rectAllowed.y+cellInfo.y*cellInfo.sizeCell.h+cellInfo.sizeCell.h/2

          this.setStartPositionDragGift(x, y)
          
        })
      }
    } else if (this.stage === 2 || this.stage === 3) {
      const display = this.getEscalateDOM(target, 'display')
      if (display) {
        this.isRotateGift = true
        document.body.style.userSelect = 'none'
      }
    }

  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: any): void {
    this.mouse.down = false

    let [x, y] = [e.clientX, e.clientY]

    if (this.stage === 1) {
      document.body.style.userSelect = 'auto'
      document.body.style.cursor = 'auto'

      if (this.dragGift.img) {
        this.dragGift.waiting = false

        const cellInfo = this.cellBoxDragging(x, y)

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

        this.dragGift.id = null
        this.dragGift.img = null
        this.dragGift.position = { x: 0, y: 0 }
        this.dragGift.size = { w: 0, h: 0 }
        this.dragGift.animated = false
        this.hiddenGifts.clear()
      }
    } else if (this.stage === 2 || this.stage === 3) {
      this.isRotateGift = false
      document.body.style.userSelect = 'auto'

      this.box.rotate.x = (this.box.rotate.x+this.box.shiftRotate.x)%360
      this.box.rotate.y = (this.box.rotate.y+this.box.shiftRotate.y)%360
      this.box.shiftRotate.x = 0
      this.box.shiftRotate.y = 0
    }
  }

  @HostListener('window:mousemove', ['$event']) onMouseMove(e: any): void {
    if (!this.mouse.down) return

    let [x, y] = [e.clientX, e.clientY]

    if (this.stage === 1) {
      if (this.dragGift.img) {

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
      }
    } else if (this.stage === 2 || this.stage === 3) {
      if (this.isRotateGift) {
        let dx = x-(this.mouse.start.x || 0)
        let dy = y-(this.mouse.start.y || 0)
        
        this.box.shiftRotate.x = -dy
        this.box.shiftRotate.y = dx
      }
    }

  }

  async setStage1(): Promise<void> {

    this.transition = true

    this.stage = 1

    this.wrap.animated = true
    this.box.animate = true

    await this.asyncService.delay(10)

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0
    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    await this.asyncService.delay(1000)

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0
    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    await this.asyncService.delay(300)

    this.showGifts = true

    await this.asyncService.delay(10)

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())
  }

  async setStage1From2(): Promise<void> {

    this.transition = true

    this.stage = 1

    this.wrap.animated = true
    this.box.animate = true

    await this.asyncService.delay(10)

    this.showWrap = false

    await this.asyncService.delay(300)

    this.box.wrapped = false

    await this.asyncService.delay(5000)

    this.box.packed = false

    await this.asyncService.delay(1000)

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0
    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    await this.asyncService.delay(300)

    this.showGifts = true

    await this.asyncService.delay(300)

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())

  }

  async setStage2(): Promise<void> {

    this.transition = true

    this.stage = 2

    this.wrap.animated = true
    this.box.animate = true

    await this.asyncService.delay(10)

    this.showGifts = false

    await this.asyncService.delay(300)

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0
    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    await this.asyncService.delay(300)

    this.box.packed = true

    await this.asyncService.delay(1000)

    this.box.wrapped = true

    await this.asyncService.delay(6000)

    this.showWrap = true

    await this.asyncService.delay(300)

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())
  }

  async setStage2From3(): Promise<void> {

    this.transition = true

    this.stage = 3

    this.wrap.animated = true
    this.box.animate = true

    await this.asyncService.delay(10)

    this.showTape = false

    await this.asyncService.delay(300)

    this.box.tapped = false

    await this.asyncService.delay(4000)

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0
    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    await this.asyncService.delay(300)

    this.showWrap = true

    await this.asyncService.delay(300)

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())
  }

  async setStage3(): Promise<void> {

    this.transition = true

    this.stage = 3

    this.wrap.animated = true
    this.box.animate = true

    await this.asyncService.delay(10)

    this.showWrap = false

    await this.asyncService.delay(300)

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0
    this.box.rotate.x = -15
    this.box.rotate.y = 110
    this.box.rotate.z = 0

    await this.asyncService.delay(300)

    this.box.tapped = true

    await this.asyncService.delay(4000)

    this.showTape = true

    await this.asyncService.delay(300)

    this.wrap.animated = false
    this.box.animate = false

    this.transition = false

    return new Promise(res => res())
  }

  completeStage(): void {
    console.log('go go go')
  }

  setPackageBox(img: string) {
    this.box.package = img
  }

  setTapeBox(img: string) {
    this.box.tape = img
  }

  trySetStage2(): void {
    if (this.inBox.length < this.gifts.length) {
      this.showError(this.locationService.translate('Put all the gifts in a box', 'Положите все подарки в коробку'))
    } else if (this.inBox.length === this.gifts.length) {
      this.setStage2()
    }
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

  isGiftInBox(gift: any): boolean {
    return this.inBox.find(x => x === gift.id) ? true : false
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

  async setStartPositionDragGift(x: number, y: number): Promise<void> {

    let k = 0.9

    this.dragGift.animated = true

    await this.asyncService.delay(0)

    let cellInfo = this.cellBoxDragging(x, y)

    this.dragGift.allowed = cellInfo.allowed

    if (!cellInfo.allowed) {
      // this.dragGift.animated = false
      this.dragGift.position.x = x
      this.dragGift.position.y = y
    } else {
      // this.dragGift.animated = true
      this.dragGift.position.x = cellInfo.rectAllowed.x+cellInfo.x*cellInfo.sizeCell.w+cellInfo.sizeCell.w/2
      this.dragGift.position.y = cellInfo.rectAllowed.y+cellInfo.y*cellInfo.sizeCell.h+cellInfo.sizeCell.h/2
    }

    this.dragGift.size.w = cellInfo.sizeCell.w*k
    this.dragGift.size.h = cellInfo.sizeCell.h*k

    await this.asyncService.delay(300)

    // this.dragGift.animated = false
    this.dragGift.waiting = false
    this.dragGift.animated = false

    return new Promise(res => res())
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

  getGiftById(id: number): any {
    return this.gifts.find(x => x.id === id) || null
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
      this.box.size.w = 300
      this.box.size.d = 300
    } else if (countGifts >= 4 && countGifts < 6) {
      this.grid = { w: 2, h: 2 }
      this.box.size.w = 400
      this.box.size.d = 400
    } else if (countGifts >= 6 && countGifts < 9) {
      this.grid = { w: 3, h: 2 }
      this.box.size.w = 300
      this.box.size.d = 500
    } else if (countGifts >= 9) {
      this.grid = { w: 3, h: 3 }
      this.box.size.w = 500
      this.box.size.d = 500
    }

    let maxHeight = 0

    this.gifts.forEach((gift: any) => {
      maxHeight += this.getDepthGift(gift)
    })

    maxHeight += 20

    // if (maxHeight < 20) maxHeight = 20

    // // -------
    // this.grid = { w: 2, h: 2 }
    // // -------

    this.box.size.h = maxHeight
  }

  inputUploadImage(e: any): void {
    this.saveUploadImage(e.target.files[0])
  }

  cancelTrim(): void {
    this.imageUpload.mode = 'usual'

    if (this.imageUpload.cancelImg !== '') this.imageUpload.img = this.imageUpload.cancelImg

    this.imageUpload.cancelImg = ''
  }

  async tryuploadimage(e: any): Promise<any> {
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
      this.imageUpload.mode = 'trim'
      this.imageUpload.cancelImg = this.imageUpload.img
      this.imageUpload.img = img.src
    } else {
      this.showError(error.join('; '))
      e.target.value = null
    }

    return new Promise(res => res(true))
  }

  saveUploadImage(image: string): void {
    this.imageUpload.mode = 'usual'

    if (this.imageUpload.type === 'package') {
      this.box.package = image
    } else if (this.imageUpload.type === 'tape') {
      this.box.tape = image
    }

    this.imageUpload.cancelImg = ''
    // this.imageUpload.type = 'none'
  }

  showUploadImagePackage(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.box.package
    this.imageUpload.type = 'package'
    this.imageUpload.ratio = 100/100
    this.imageUpload.mode = 'usual'
  }

  showUploadImageTape(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.box.tape
    this.imageUpload.type = 'tape'
    this.imageUpload.ratio = 100/100
    this.imageUpload.mode = 'usual'
  }

  backToPrice(): void {
    console.log('back back back')
  }

  ngOnInit(): void {

    this.setStage1()

    this.gifts = JSON.parse(window.localStorage.getItem('gifts') || '[]')

    this.setBoxSizeAndGrid()
  }

}

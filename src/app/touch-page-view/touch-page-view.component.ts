import { Component, OnInit, EventEmitter, ViewContainerRef, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { LocationService } from '../services/location.service'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'
import { TouchService, Touch } from '../touch.service'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { OptionMenu } from '../touch-menu/touch-menu.component'
import { BackendService } from '../services/backend.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-touch-page-view',
  templateUrl: './touch-page-view.component.html',
  styleUrls: ['./touch-page-view.component.scss'],
  animations: [
    trigger('hint', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('0.2s ease', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('0.2s ease', style({ transform: 'translateY(100%)' }))
      ])
    ]),
    trigger('menu', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('0.2s ease', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('0.2s ease', style({ transform: 'translateY(-100%)' }))
      ])
    ]),
    trigger('mainText', [
      transition(':enter', [
        style({ transform: 'scale(0.1)', opacity: '0' }),
        animate('0.2s ease', style({ transform: 'scale(1)', opacity: '1' }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: '1' }),
        animate('0.2s ease', style({ transform: 'scale(0.1)', opacity: '0' }))
      ])
    ]),
    trigger('mainText2', [
      transition(':enter', [
        style({ transform: 'translateY(calc(-70px - 100%))' }),
        animate('0.2s ease', style({ transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0px)' }),
        animate('0.2s ease', style({ transform: 'translateY(calc(-70px - 100%))' }))
      ])
    ]),
    trigger('mainText3', [
      transition(':enter', [
        style({ transform: 'translateY(calc(-70vh - 100%))' }),
        animate('0.2s ease', style({ transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0px)' }),
        animate('0.2s ease', style({ transform: 'translateY(calc(-70vh - 100%))' }))
      ])
    ]),
    trigger('code', [
      transition(':enter', [
        style({ transform: 'translateY(-100vh)' }),
        animate('0.4s ease', style({ transform: 'translateY(0vh)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0vh)' }),
        animate('0.4s ease', style({ transform: 'translateY(-100vh)' }))
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
    trigger('slideTopGiftBlock', [
      transition(':enter', [
        style({ transform: 'translateY(100vh)', opacity: '0' }),
        animate('0.5s {{delay}} ease', style({ transform: 'translateY(0px)', opacity: '1' }))
      ])
    ]),
  ]
})
export class TouchPageViewComponent implements OnInit {

  subs: Array<Subscription> = []

  code: string = '1000'
  toRejectCode: EventEmitter<void> = new EventEmitter<void>()
  toAcceptCode: EventEmitter<void> = new EventEmitter<void>()
  toInputCode: EventEmitter<void> = new EventEmitter<void>()
  disabledCode: boolean = false

  stage: number = 1

  triesCode: number = 3

  inBox: Array<any> = []

  gifts: Array<any> = []

  firstMove: boolean = true
  modeMove: 'horizontal' | 'vertical' = 'horizontal'
  velocityMove: number = 0
  velocityTimeout = setTimeout(() => {}, 0)

  general: any = {}

  wrap: any = {
    x: 0,
    y: 0,
    scale: 1,
    disable: false,
    animated: false,
    shift: { x: 0, y: 0 },
    show: false
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

  confirm: any = {
    value: '',
    type: ''
  }

  activeGift: any = {
    id: null,
    animated: false
  }

  public refreshSnapshots: boolean = false

  sublimePoemScrollToCenter: boolean = false
  sublimeHowToUseScrollToCenter: boolean = false
  sublimeCodeGameScrollToCenter: boolean = false
  sublimeGeneralInfoScrollToCenter: boolean = false

  activeWatchVideo: boolean = false

  // dragGift: any = {
  //   timeout: setTimeout(() => {}, 0),
  //   img: null,
  //   position: { x: 0, y: 0 },
  //   size: { w: 0, h: 0 },
  //   animated: false,
  //   id: null,
  //   waiting: false,
  //   allowed: false
  // }

  public menu: Array<OptionMenu> = []
  public menuSublimeShow: boolean = false

  @ViewChild('menuGiftsRef', { read: ElementRef }) menuGiftsRef!: ElementRef

  public touches: any = {
    first: null,
    code: null,
    main: null,
    giftslist: null,
    screenViewGift: null,
    menu: null,
    archive: null,
    poem: null,
    howToUse: null,
    codeGame: null,
    screenListenAudio: null,
    screenWatchVideo: null,
    generalInfo: null
  }

  public disableds: any = {
    first: true,
    code: true,
    main: true,
    giftslist: true,
    screenViewGift: true,
    menu: true,
    archive: true,
    poem: true,
    howToUse: true,
    codeGame: true,
    screenListenAudio: true,
    screenWatchVideo: true,
    generalInfo: true
  }

  public stats: any = {
    first: 'close',
    code: 'close',
    main: 'close',
    giftslist: 'close',
    screenViewGift: 'close',
    menu: 'close',
    archive: 'close',
    poem: 'close',
    howToUse: 'close',
    codeGame: 'close',
    screenListenAudio: 'close',
    screenWatchVideo: 'close',
    generalInfo: 'close'
  }

  activeGiftView: any = null
  modeViewGift: string = 'usual'
  sublimeRefreshViewGift: boolean = false
  buttomTextView: string = this.locationService.translate('additional information in the right menu', 'доп. инфа в правом меню')

  private flagdbl = false
  private timeoutdbl = setTimeout(() => {}, 0)

  constructor(
    public locationService: LocationService,
    public touchService: TouchService,
    private asyncService: AsyncService,
    public viewContainerRef: ViewContainerRef,
    public changeDetectorRef: ChangeDetectorRef,
    private backendService: BackendService,
    private router: Router
  ) { }

  getGiftById(id: number): any {
    return this.gifts.find(x => x.id === id) || null
  }

  closeScreen(type: string): void {
    this.disableds[type] = true
    this.stats[type] = 'close'
  }

  showScreen(type: string): void {
    this.disableds[type] = false
    this.stats[type] = 'open'
  }

  dropListGifts(event: CdkDragDrop<string[]>) {
    let g = this.gifts[event.previousIndex]
    this.gifts.splice(event.previousIndex, 1)
    this.gifts.splice(event.currentIndex, 0, g)
  }

  actionMenu(act: string): void {
    this.stats.menu = act
  }

  menuWasChoosen(val: string): void {
    console.log(val)

    if (val === 'text') {
      if (this.activeGiftView.type === 'greetingcard') {
        this.closeScreen('screenViewGift')
        this.showScreen('poem')
        this.sublimePoemScrollToCenter = !this.sublimePoemScrollToCenter
        this.menu = []
      }
    } else if (val === 'howToUse') {
      console.log(this.activeGiftView)
      if (this.activeGiftView.type === 'game') {
        this.closeScreen('screenViewGift')
        this.showScreen('howToUse')
        this.sublimeHowToUseScrollToCenter = !this.sublimeHowToUseScrollToCenter
        this.menu = []
      }
    } else if (val === 'open') {
      if (this.activeGiftView.type === 'game') {
        this.activeGiftView.open = true
      }
      this.setMenuViewGift()
    } else if (val === 'close') {
      if (this.activeGiftView.type === 'game') {
        this.activeGiftView.open = false
      }
      this.setMenuViewGift()
    } else if (val === 'code') {
      if (this.activeGiftView.type === 'game') {
        this.closeScreen('screenViewGift')
        this.showScreen('codeGame')
        this.sublimeCodeGameScrollToCenter = !this.sublimeCodeGameScrollToCenter
        this.menu = []
      }
    } else if (val === 'listen') {
      if (this.activeGiftView.type === 'speaker') {
        this.closeScreen('screenViewGift')
        this.showScreen('screenListenAudio')
        this.menu = []
      }
    } else if (val === 'watch') {
      if (this.activeGiftView.type === 'tablet') {
        this.closeScreen('screenViewGift')
        this.showScreen('screenWatchVideo')
        this.menu = []
        this.activeWatchVideo = true
      }
    } else if (val === 'generalInfo') {
      this.closeScreen('screenViewGift')
      this.showScreen('generalInfo')
      this.menu = []
      this.sublimeGeneralInfoScrollToCenter = !this.sublimeGeneralInfoScrollToCenter
    }
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

  // getRatioGift(gift: any): void {

  //   let ratioGift = 1
  //   if (gift.type === 'greetingcard') {
  //     ratioGift = 297/420
  //   } else if (gift.type === 'game') {
  //     ratioGift = 135/190
  //   } else if (gift.type === 'speaker') {
  //     return window.innerWidth*k
  //   } else if (gift.type === 'tablet') {
  //     return window.innerWidth*k
  //   } else if (gift.type === 'photo') {
  //     return window.innerHeight*(48/64)*k
  //   }

  //   return ratio
  // }

  getSizeActiveGift(gift: any): number {
    let k = 0.9;

    let minY = -((window.innerHeight/4)/this.wrap.scale)-this.wrap.y/this.wrap.scale
    let maxY = -this.wrap.y/this.wrap.scale

    let y = gift.pos.y

    if (gift.type === 'greetingcard') {
      return window.innerWidth/this.wrap.scale*(297/420)*k*(((y-minY)/(maxY-minY))/2+0.5)
    } else if (gift.type === 'game') {
      return window.innerWidth/this.wrap.scale*(135/190)*k*(((y-minY)/(maxY-minY))/2+0.5)
    } else if (gift.type === 'speaker') {
      return window.innerWidth/this.wrap.scale*k*(((y-minY)/(maxY-minY))/2+0.5)
    } else if (gift.type === 'tablet') {
      return window.innerWidth/this.wrap.scale*k*(((y-minY)/(maxY-minY))/2+0.5)
    } else if (gift.type === 'photo') {
      return window.innerWidth/this.wrap.scale*(48/64)*k*(((y-minY)/(maxY-minY))/2+0.5)
    }

    return 0
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

  async setStage2(): Promise<void> {
    this.closeScreen('first')
    this.showScreen('code')

    this.stage = 0

    await this.asyncService.delay(200)

    this.stage = 2

    return new Promise(res => res())
  }

  async setStage3(): Promise<void> {
    this.closeScreen('code')
    this.showScreen('main')

    this.toAcceptCode.emit()

    this.wrap.show = true

    await this.asyncService.delay(1000)

    this.stage = 0

    this.box.animate = true

    await this.asyncService.delay(400)

    this.box.coord.y = 0

    await this.asyncService.delay(300)

    this.stage = 3

    this.box.animate = false

    return new Promise(res => res())
  }

  async setStage4NoAnimation(): Promise<void> {

    this.box.animate = false
    this.wrap.animated = false
    this.wrap.show = true

    this.box.tapped = false
    this.box.wrapped = false
    this.box.packed = false

    await this.asyncService.delay(10)

    this.wrap.scale = this.getScaleBoxToFitScreen()

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    // await this.asyncService.delay(300)

    this.stage = 4

    this.wrap.animated = false
    this.box.animate = false

    return new Promise(res => res())
  }

  async setStage4(): Promise<void> {
    // this.closeScreen('code')
    // this.showScreen('main')

    this.stage = 0

    this.box.animate = true
    this.wrap.animated = true

    this.box.tapped = false

    await this.asyncService.delay(4000)

    this.box.wrapped = false

    await this.asyncService.delay(6000)

    this.box.packed = false

    await this.asyncService.delay(2000)

    this.wrap.scale = this.getScaleBoxToFitScreen()

    this.box.rotate.x = -90
    this.box.rotate.y = 90
    this.box.rotate.z = 0

    this.box.coord.x = 0
    this.box.coord.y = 0
    this.box.coord.z = 0

    await this.asyncService.delay(300)

    this.stage = 4

    this.wrap.animated = false
    this.box.animate = false

    return new Promise(res => res())
  }

  async setStage5NoAnimation(): Promise<void> {
    this.closeScreen('main')
    this.showScreen('archive')

    this.inBox = []

    this.stage = 0

    this.box.animate = true
    this.wrap.animated = true

    this.box.y = -1000

    this.wrap.show = false

    this.stage = 5

    this.wrap.animated = false
    this.box.animate = false

    this.setMenuHome()

    return new Promise(res => res())
  }

  async setStage5(): Promise<void> {
    this.closeScreen('main')
    this.showScreen('archive')

    this.stage = 0

    this.box.animate = true
    this.wrap.animated = true

    await this.asyncService.delay(10)

    this.box.y = -1000

    await this.asyncService.delay(300)

    this.wrap.show = false

    this.stage = 5

    this.wrap.animated = false
    this.box.animate = false

    this.setMenuHome()

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

  showViewGift(gift: any): void {
    // console.log(gift)

    this.closeScreen('archive')
    this.showScreen('screenViewGift')
    this.activeGiftView = gift
    this.sublimeRefreshViewGift = !this.sublimeRefreshViewGift
    this.setMenuViewGift()

    if (gift.type === 'photo') {
      this.buttomTextView = ''
    } else {
      this.buttomTextView = this.locationService.translate('additional information in the right menu', 'доп. инфа в правом меню')
    }
  }

  closeScreenViewGift(): void {
    if (
      this.stats.poem === 'open'
      || this.stats.howToUse === 'open'
      || this.stats.codeGame === 'open'
      || this.stats.screenListenAudio === 'open'
      || this.stats.screenWatchVideo === 'open'
    ) return
    this.activeGiftView = null

    this.closeScreen('screenViewGift')
    this.showScreen('archive')

    this.modeViewGift = 'usual'

    this.setMenuHome()
  }

  setMenuHome(): void {
    let menu = [{
      title: this.locationService.translate('general info', 'общая информация'),
      ico: '../../assets/menu.svg',
      value: 'generalInfo'
    }]

    this.menu = menu
  }

  setDisableds(t: Touch): void {
    if (this.stats.menu === 'open') {
      this.disableds.screenViewGift = true
      this.disableds.menu = false
    } else if (this.stats.screenViewGift === 'open') {
      if (this.modeViewGift === 'review') {
        this.disableds.screenViewGift = false
        this.disableds.menu = true
      } else {
        if (t.action === 'move' && t.prev !== null && t.prev.action === 'start') {
          const delta: Array<number> = [t.x-t.prev!.x, t.y-t.prev!.y]
          if (Math.abs(delta[1]) > Math.abs(delta[0])) {
            this.disableds.screenViewGift = false
            this.disableds.menu = true
          } else {
            if (delta[0] < 0) {
              this.disableds.screenViewGift = true
              this.disableds.menu = false
            } else {
              this.disableds.screenViewGift = false
              this.disableds.menu = true
            }
          }
        }
      }
    } else if (this.stats.archive === 'open') {
      if (t.action === 'move' && t.prev !== null && t.prev.action === 'start') {
        const delta: Array<number> = [t.x-t.prev!.x, t.y-t.prev!.y]
        if (Math.abs(delta[1]) > Math.abs(delta[0])) {
          this.disableds.archive = false
          this.disableds.menu = true
        } else {
          if (delta[0] < 0) {
            this.disableds.archive = true
            this.disableds.menu = false
          } else {
            this.disableds.archive = false
            this.disableds.menu = true
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
    if (this.confirm.type === 'lastTry') {
      this.disabledCode = false

      if (res === 'agree') {
        this.toInputCode.emit()
      }
    }

    this.confirm.value = ''
    this.confirm.type = ''
  }

  setMenuViewGift(): void {
    if (this.activeGiftView === null && this.stats.screenViewGift === 'close') return
    let menu = []
    if (this.activeGiftView.type === 'greetingcard') {
      menu.push({
        title: this.locationService.translate('text', 'стихотворение'),
        ico: '../../assets/text.svg',
        value: 'text'
      })
    } else if (this.activeGiftView.type === 'game') {
      if (
        this.activeGiftView.platform === 'ps'
        || this.activeGiftView.platform === 'xbox'
      ) {
        menu.push({
          title: this.locationService.translate('how to activate', 'как активировать'),
          ico: '../../assets/question-mark.svg',
          value: 'howToUse'
        })
      }
      if (this.activeGiftView.open) {
        menu.push({
          title: this.locationService.translate('close', 'закрыть'),
          ico: '../../assets/open.svg',
          value: 'close'
        })
      } else {
        menu.push({
          title: this.locationService.translate('open', 'открыть'),
          ico: '../../assets/open.svg',
          value: 'open'
        })
      }
      menu.push({
        title: this.locationService.translate('redeem key', 'активационный ключ'),
        ico: '../../assets/password.svg',
        value: 'code'
      })
    } else if (this.activeGiftView.type === 'speaker') {
      if (this.activeGiftView.value[0]) {
        menu.push({
          title: this.locationService.translate('listen', 'прослушать'),
          ico: '../../assets/speaker.svg',
          value: 'listen'
        })
      }
    } else if (this.activeGiftView.type === 'tablet') {
      if (this.activeGiftView.value !== null && this.activeGiftView.value !== '') {
        menu.push({
          title: this.locationService.translate('watch', 'просмотр'),
          ico: '../../assets/eye.svg',
          value: 'watch'
        })
      }
    } else if (this.activeGiftView.type === 'photo') {
    }
    this.menu = menu
  }

  async onInputLock(code: string): Promise<void> {
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

      this.setGifts(gifts)

      this.setStage3()
    }

    this.disabledCode = false

    // if (code === '1000') {
    //   this.setStage3()
    // } else {
    //   this.toRejectCode.emit()
    //   this.triesCode--
    // }

    return new Promise(res => res())
  }

  getTopGiftFromCell(x: number, y: number): any {

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

  getSizeBackActive(): { w: number, h: number } {
    return {
      w: 3*window.innerWidth*this.wrap.scale,
      h: 3*window.innerHeight*this.wrap.scale
    }
  }

  async throwActiveGift(gift: any): Promise<void> {
    let shiftY = -10

    const el = this.menuGiftsRef.nativeElement
    const rect = el.getBoundingClientRect()

    this.activeGift.animated = true

    await this.asyncService.delay(10)

    let [x, y] = [rect.x+rect.width/2, rect.y+rect.height/2]

    gift.pos.x = (-this.wrap.x+(x-window.innerWidth/2))/this.wrap.scale
    gift.pos.y = (-this.wrap.y+(y-window.innerHeight/2))/this.wrap.scale+shiftY
    gift.pos.z = 2*this.box.size.h

    await this.asyncService.delay(300)

    // el.style.animationName = 'throwAnim'

    this.inBox = this.inBox.filter(x => x !== this.activeGift.id)
    this.activeGift.id = null
    this.activeGift.animated = false

    if (this.inBox.length === 0) {
      this.setStage5()
    }

    // await this.asyncService.delay(1000)

    // el.style.removeProperty('animation-name')

    return new Promise(res => res())
  }

  async setActiveGift(gift: any): Promise<void> {
    this.activeGift.animated = true

    await this.asyncService.delay(10)

    this.activeGift.id = gift.id

    gift.pos.x = -this.wrap.x/this.wrap.scale
    gift.pos.y = -this.wrap.y/this.wrap.scale
    gift.pos.z = 999*this.box.size.h

    await this.asyncService.delay(400)

    this.activeGift.animated = false

    return new Promise(res => res())
  }

  async switchOpenGiftGame(gift: any): Promise<void> {
    if (gift.type !== 'game') return new Promise(res => res())

    this.activeGift.animated = true

    await this.asyncService.delay(10)

    gift.open = !gift.open

    await this.asyncService.delay(300)

    this.activeGift.animated = false

    return new Promise(res => res())
  }

  processTouch(t: Touch): void {

    this.setDisableds(t)

    Object.keys(this.touches).forEach((k: string) => { this.touches[k] = null })

    if (!this.disableds.archive) this.touches.archive = t
    if (!this.disableds.screenViewGift) this.touches.screenViewGift = t
    if (!this.disableds.menu) this.touches.menu = t
    if (!this.disableds.poem) this.touches.poem = t
    if (!this.disableds.howToUse) this.touches.howToUse = t
    if (!this.disableds.codeGame) this.touches.codeGame = t
    if (!this.disableds.screenListenAudio) this.touches.screenListenAudio = t
    if (!this.disableds.screenWatchVideo) this.touches.screenWatchVideo = t
    if (!this.disableds.generalInfo) this.touches.generalInfo = t

    if (this.stage === 1) {
      if (t.action === 'end') {
        this.setStage2()
      }
    } else if (this.stage === 2) { 
      if (t.action === 'end' && !t.drag) {
        if (this.triesCode === 1) {
          setTimeout(() => {
            this.disabledCode = true
            this.showConfirm('lastTry', this.locationService.translate('Last try. Then the gift is blocked. You will have to ask the sender to unblock it.', 'Последняя попытка. Дальше подарок блокируется. Придётся просить отправителя, чтобы он разблокировал.'))
          }, 10)
        } else if (this.triesCode > 1) {
          this.toInputCode.emit()
        }
      }
    } else if (this.stage === 3) {
      if (t.action === 'end' && !t.drag) {
        this.setStage4()
      }
    } else if (this.stage === 4) {

      if (t.action === 'move' && this.activeGift.id === null) {

        let cellInfo = this.cellBoxDragging(t.x, t.y)

        let minX = -(window.innerWidth/2+cellInfo.rectAllowed.w/2)
        let minY = -(window.innerHeight/2+cellInfo.rectAllowed.h/2)
        let maxX = (window.innerWidth/2+cellInfo.rectAllowed.w/2)
        let maxY = (window.innerHeight/2+cellInfo.rectAllowed.h/2)

        let x = t.x-t.start!.x
        let y = t.y-t.start!.y

        if (this.wrap.x+x < minX) x = minX-this.wrap.x
        if (this.wrap.y+y < minY) y = minY-this.wrap.y
        if (this.wrap.x+x > maxX) x = maxX-this.wrap.x
        if (this.wrap.y+y > maxY) y = maxY-this.wrap.y

        this.wrap.shift.x = x
        this.wrap.shift.y = y

      } else if (t.action === 'move' && this.activeGift.id !== null) {

        if (t.prev) {
          this.velocityMove = t.y-t.prev.y
          clearTimeout(this.velocityTimeout)
          this.velocityTimeout = setTimeout(() => {
            this.velocityMove = 0
          }, 200)
        }
        
        if (this.firstMove) {
          if (Math.abs(t.x-t.start!.x) >= Math.abs(t.y-t.start!.y)) {
            this.modeMove = 'horizontal'
          } else {
            this.modeMove = 'vertical'
          }
        }

        if (this.modeMove === 'horizontal') {
          const gift = this.getGiftById(this.activeGift.id)
          gift.shiftRotate.x = -(t.x-t.start!.x)%360
        } else if (this.modeMove === 'vertical') {
          const gift = this.getGiftById(this.activeGift.id)

          let y = (t.y-t.start!.y)/this.wrap.scale

          let maxY = 0
          let minY = -((window.innerHeight/4)/this.wrap.scale)

          if (y > maxY) y = maxY
          if (y < minY) y = minY

          gift.pos.y = y-this.wrap.y/this.wrap.scale
        }

      } else if (t.action === 'end' && !t.drag && this.activeGift.id === null) {

        let cellInfo = this.cellBoxDragging(t.x, t.y)

        if (cellInfo.allowed) {
          let gift = this.getTopGiftFromCell(cellInfo.x, cellInfo.y)
          this.setActiveGift(gift)
        }

      } else if (t.action === 'end' && !t.drag && this.activeGift.id !== null) {

        const gift = this.getGiftById(this.activeGift.id)

        if (gift.type === 'game') {

          this.switchOpenGiftGame(gift)
        }

      } else if (t.action === 'end' && t.drag && this.activeGift.id !== null) {

        const gift = this.getGiftById(this.activeGift.id)

        gift.rotate.x += gift.shiftRotate.x
        gift.rotate.x = gift.rotate.x%360
        gift.shiftRotate.x = 0

        let velocity = this.velocityMove

        let minY = -((window.innerHeight/4)/this.wrap.scale)-this.wrap.y/this.wrap.scale
        let maxY = -this.wrap.y/this.wrap.scale
        let progress = (gift.pos.y-minY)/(maxY-minY)

        if (this.modeMove === 'vertical') {
          if (velocity < 0 || progress < 0.5) {
            this.throwActiveGift(gift)
          } else if (velocity > 0 || progress >= 0.5) {
            this.setActiveGift(gift)
          }
        }

        // let maxY = 0
        // let minY = -((window.innerHeight/4)/this.wrap.scale)

      } else if (t.action === 'end' && t.drag) {

        this.wrap.x += this.wrap.shift.x
        this.wrap.y += this.wrap.shift.y
        this.wrap.shift.x = 0
        this.wrap.shift.y = 0

      }

      if (t.action === 'move') {
        this.firstMove = false
      }

      if (t.action === 'end') {
        this.firstMove = true
      }
    }

    if (t.action === 'end' && t.drag === false) {
      if (this.flagdbl) {
        this.dbltap()
        this.flagdbl = false
      } else {
        clearTimeout(this.timeoutdbl)
        this.flagdbl = true
        this.timeoutdbl = setTimeout(() => {
          this.flagdbl = false
        }, 200)
      }
    }

  }

  dbltap(): void {
    if (this.stats.screenViewGift === 'open') {
      if (this.modeViewGift == 'usual') {
        this.modeViewGift = 'review'
        // this.menu = []
      } else if (this.modeViewGift == 'review') {
        this.modeViewGift = 'usual'
        // this.setmenuviewgift()
      }
    }
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

  closeScreenPoem(): void {
    this.closeScreen('poem')
    this.showScreen('screenViewGift')
    this.setMenuViewGift()
  }

  closeScreenHowToUse(): void {
    this.closeScreen('howToUse')
    this.showScreen('screenViewGift')
    this.setMenuViewGift()
  }

  closeScreenCodeGame(): void {
    this.closeScreen('codeGame')
    this.showScreen('screenViewGift')
    this.setMenuViewGift()
  }

  closeScreenListenAudio(): void {
    this.closeScreen('screenListenAudio')
    this.showScreen('screenViewGift')
    this.setMenuViewGift()
  }

  closeWatchVideo(): void {
    this.closeScreen('screenWatchVideo')
    this.showScreen('screenViewGift')
    this.setMenuViewGift()
    this.activeWatchVideo = false
  }

  closeGeneralInfo(): void {
    this.closeScreen('generalInfo')
    this.showScreen('archive')
    this.setMenuHome()
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
      rectAllowed.x = this.wrap.x
      rectAllowed.y = this.wrap.y+(screenRect.h-boxRect.h)/2
    } else if (boxRect.ratio < screenRect.ratio) {
      rectAllowed.x = this.wrap.x+(screenRect.w-boxRect.w)/2
      rectAllowed.y = this.wrap.y
    }

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

    this.backendService.getBoxGeneralByLink(link).then((response: any) => {

      if (!response.success || !response.result) return

      this.triesCode = response.result.attempts

      this.general.id = response.result.id

    })
  }

  ngOnInit(): void {

    this.getBoxGeneral()

    // this.box.coord.y = -window.innerHeight

    // this.setGifts()
    // this.box = { ...this.box, ...JSON.parse(window.localStorage.getItem('box') || '{}') }

    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )

    // this.setStage5NoAnimation()

  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

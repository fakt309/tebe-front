import { Component, OnInit, OnDestroy, ComponentFactoryResolver, ComponentRef, ViewContainerRef, ViewChild, ComponentFactory, ElementRef, HostListener, ViewChildren, QueryList } from '@angular/core'
import { trigger, state, style, animate, transition, stagger, query, group } from '@angular/animations'
import { AsyncService } from '../async.service'
import { DesktopGiftListOptionComponent } from '../desktop-gift-list-option/desktop-gift-list-option.component'
import { LocationService } from '../services/location.service'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-desktop-page-create-stage1',
  templateUrl: './desktop-page-create-stage1.component.html',
  styleUrls: ['./desktop-page-create-stage1.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ display: 'none', opacity: 0 }),
        animate('0ms 320ms ease', style({ display: 'flex', opacity: 0 })),
        animate('300ms ease', style({ display: 'flex', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeAdd', [
      transition(':enter', [
        group([
          style({ 'background-color': '#00000000' }),
          query('.content', style({ 'transform': 'translateX(min(100%, 600px))' }))
        ]),
        group([
          animate('300ms ease', style({ 'background-color': '#00000066' })),
          query('.content', animate('300ms ease', style({ 'transform': 'translateX(0px)' })))
        ])
      ]),
      transition(':leave', [
        group([
          animate('300ms ease', style({ 'background-color': '#00000000' })),
          query('.content', animate('300ms ease', style({ 'transform': 'translateX(min(100%, 600px))' })))
        ])
      ])
    ]),
    trigger('fadeOption', [
      transition(':enter', [
        style({ 'transform': 'translateY(300px)', 'opacity': '0', 'max-height': '0px' }),
        animate('1000ms ease', style({ 'transform': 'translateY(0px)', 'opacity': '1', 'max-height': '500px' }))
      ])
    ])
  ]
})
export class DesktopPageCreateStage1Component implements OnInit, OnDestroy {

  @ViewChildren(DesktopGiftListOptionComponent) optionsGifts!: QueryList<DesktopGiftListOptionComponent>
  @ViewChild('moveGift', { read: ViewContainerRef }) moveGiftContainerTemplate!: ViewContainerRef
  moveGiftContainer!: ComponentRef<DesktopGiftListOptionComponent>

  gifts: Array<any> = []
  activeGift: any = null
  screens: any = {
    listGifts: 'open',
    addGift: 'close'
  }
  moveGift: any = {
    isMoving: false,
    delta: 0,
    container: null,
    gift: null,
    index: 0,
    scrolling: false,
    intervalScroll: setInterval(() => {}, 9999)
  }

  initialRectViewGift: any = null

  sublimeStartRotate: boolean = false
  sublimeStopRotate: boolean = false

  private subs: Array<Subscription> = []

  showSelectLanguage: boolean = false

  constructor(
    public locationService: LocationService,
    private asyncService: AsyncService,
    private cfr: ComponentFactoryResolver,
    private host: ElementRef,
    private route: ActivatedRoute
  ) { }

  @HostListener('window:mousemove', ['$event']) onMousemove(e: any): void {
    if (this.moveGift.isMoving) {
      const y = e.clientY
      const el: HTMLElement = this.moveGift.container.location.nativeElement

      // el.style.left = this.optionsGifts.first.host.nativeElement.getBoundingClientRect().x+'px'
      el.style.top = (y-this.moveGift.delta)+'px'

      let rects: Array<any> = []
      this.optionsGifts.forEach(el => {
        el.host.nativeElement.style.removeProperty('border-top')
        el.host.nativeElement.style.removeProperty('border-bottom')
        rects.push(el.host.nativeElement.getBoundingClientRect())
      })
      let index: number = 0
      if (y <= rects[0].y+rects[0].height/2) {
        index = -1
      } else if (y >= rects[rects.length-1].y+rects[rects.length-1].height/2) {
        index = rects.length-1
      } else {
        for (let i = 0; i < rects.length; i++) {
          if (y >= rects[i].y+rects[i].height/2 && y <= rects[i+1].y+rects[i+1].height/2) {
            index = i
            break
          }
        }
      }

      if (index === -1) {
        this.optionsGifts.first!.host.nativeElement.style.borderTop = "2px solid #333"
      } else {
        this.optionsGifts.get(index === -1 ? 0 : index)!.host.nativeElement.style.borderBottom = "2px solid #333"
      }

      this.moveGift.index = index

      if (y <= 0.1*window.innerHeight && !this.moveGift.scrolling) {
        this.startScrolling('up')
      } else if (y >= 0.9*window.innerHeight && !this.moveGift.scrolling) {
        this.startScrolling('down')
      } else if (y > 0.1*window.innerHeight && y < 0.9*window.innerHeight) {
        this.stopScrolling()
      }
    }
  }

  @HostListener('window:mouseup') onMouseup(): void {
    if (this.moveGift.isMoving) {
      document.body.style.userSelect = 'auto'
      this.stopScrolling()

      const el: HTMLElement = this.moveGift.container.location.nativeElement

      el.style.display = 'none'

      this.optionsGifts.forEach(el => {
        el.host.nativeElement.style.removeProperty('border-top')
        el.host.nativeElement.style.removeProperty('border-bottom')
      })

      this.moveGift.isMoving = false

      if (this.moveGift.index === -1) {
        this.gifts.splice(0, 0, this.moveGift.gift)
      } else {
        this.gifts.splice(this.moveGift.index+1, 0, this.moveGift.gift)
      }
      setTimeout(() => {
        this.sublimeStartRotate = !this.sublimeStartRotate
      }, 200)
    }
  }

  mixxxx(): void {
    const tmp = this.gifts[0]
    this.gifts[0] = this.gifts[1]
    this.gifts[1] = tmp
  }

  startScrolling(vector: string = 'down'): void {
    if (this.moveGift.scrolling) return

    const speed = 0.01

    this.stopScrolling()
    this.moveGift.intervalScroll = setInterval(() => {
      if (vector === 'down') {
        this.host.nativeElement.scrollTo(0, this.host.nativeElement.scrollTop+10)
      } else if (vector === 'up') {
        this.host.nativeElement.scrollTo(0, this.host.nativeElement.scrollTop-10)
      }
    })
  }

  async showEditGift(e: any): Promise<void> {
    this.sublimeStopRotate = !this.sublimeStopRotate
    await this.asyncService.delay(200)
    this.initialRectViewGift = e.rect
    this.activeGift = e.gift
    return new Promise(res => res())
  }

  closeEditGift(): void {
    this.initialRectViewGift = null
    this.activeGift = null
    this.sublimeStartRotate = !this.sublimeStartRotate
  }

  deleteGift(gift: any): void {
    this.gifts = this.gifts.filter((g: any) => g.id !== gift.id)
  }

  stopScrolling(): void {
    this.moveGift.scrolling = false
    clearInterval(this.moveGift.intervalScroll)
  }

  closeAllScreens(): void {
    Object.keys(this.screens).forEach((k: string) => {
      this.screens[k] = 'close'
    })
  }

  getGiftId(): number {
    let max = 0
    this.gifts.forEach(g => {
      if (g.id > max) max = g.id
    })
    return max+1
  }

  getGift(id: number): any {
    this.gifts.forEach(g => {
      if (g.id === id) return g
    })
  }

  removeGift(id: number): void {
    for (let i = 0; i < this.gifts.length; i++) {
      if (this.gifts[i].id === id) {
        this.gifts.splice(i, 1)
        return
      }
    }
  }

  closeAddGift(t: string): Promise<void> {
    this.screens.addGift = 'close'

    if (t === '') return new Promise(res => res())

    let gift: any = {}

    gift.id = this.getGiftId()

    if (t === 'greetingcard') {
      gift.title = this.locationService.translate('Greeting card', 'Открытка')
      gift.front = this.locationService.translate('../../assets/greetingcard/front/1.png', '../../assets/greetingcard/front/21.png')
      gift.back = '../../assets/greetingcard/back/5.jpg'
      gift.text = this.locationService.translate('May you be gifted with life’s\nbiggest joys and never-ending bliss.\nAfter all, you yourself are a gift to earth, so you deserve the best.\nHappy birthday.', 'Желаю счастья, радости, любви,\nЕще мечты заветной исполненья,\nЗдоровья крепкого, удач всегда во всем\nИ добрых слов не только в день рожденья!')
      gift.sign = []
      gift.color = '#ffffff'
    } else if (t === 'game') {
      gift.title = this.locationService.translate('Game', 'Игра')
      gift.color = '#003791'
      gift.front = '../../assets/game/example.jpg'
      gift.inside = '../../assets/game/game.png'
      gift.side = '../../assets/game/gameleft.png'
      gift.code = 'WERB-NBHP-DXCV-ZZKL-UIFM'
      gift.platform = 'ps'
      gift.open = false
    } else if (t === 'speaker') {
      gift.title = this.locationService.translate('Audio', 'Аудиозапись')
      gift.grill = '../../assets/speaker/grill/0.png'
      gift.color = "#ff5722"
      gift.value = []
    } else if (t === 'tablet') {
      gift.title = this.locationService.translate('Audio', 'Видеозапись')
      gift.color = "#c0c0c0"
      gift.value = ''
    } else if (t === 'photo') {
      gift.title = this.locationService.translate('Photo', 'Фото')
      gift.photo = '../../assets/photo/example.jpg'
      gift.sign = []
    }

    gift.type = t

    this.gifts.push(gift)

    if (this.gifts.length > 0) {
      setTimeout(() => {
        this.sublimeStartRotate = !this.sublimeStartRotate
      }, 300)
    }

    return new Promise(res => res())
  }

  moveGiftStart(data: any): void {
    this.sublimeStopRotate = !this.sublimeStopRotate
    document.body.style.userSelect = 'none'

    const factory: ComponentFactory<DesktopGiftListOptionComponent> = this.cfr.resolveComponentFactory(DesktopGiftListOptionComponent)
    this.moveGift.container = this.moveGiftContainerTemplate.createComponent(factory)
    this.moveGift.container.instance.gift = data.gift
    this.moveGift.gift = data.gift

    const el: HTMLElement = this.moveGift.container.location.nativeElement
    el.style.width = data.rect.width+'px'
    el.style.height = data.rect.height+'px'
    el.style.position = 'fixed'
    el.style.left = (data.rect.x-10)+'px'
    el.style.top = data.rect.y+'px'
    el.style.zIndex = '10'
    el.style.backgroundColor = '#ffffff'
    el.style.boxShadow = '0px 0px 5px #ddd'
    el.style.cursor = 'grabbing'
    el.style.opacity = '0.5'

    this.moveGift.isMoving = true
    this.moveGift.delta = data.event.clientY-data.rect.y
    this.removeGift(data.gift.id)
  }

  ngOnInit(): void {
    this.subs.push(
      this.route.queryParams.subscribe((params: Params) => {
        const country = params['l']
        if (country !== 'us' && country !== 'ru') {
          this.showSelectLanguage = true
        } else {
          this.showSelectLanguage = false
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
  }

}

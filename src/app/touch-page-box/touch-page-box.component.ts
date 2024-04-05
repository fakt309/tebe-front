import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { TouchService, Touch } from '../touch.service'
import { Subscription } from 'rxjs'
import { LocationService } from '../services/location.service'
import { AsyncService } from '../async.service'
import { OptionMenu } from '../touch-menu/touch-menu.component'
import { Router } from '@angular/router'
import { BackendService } from '../services/backend.service'

@Component({
  selector: 'app-touch-page-box',
  templateUrl: './touch-page-box.component.html',
  styleUrls: ['./touch-page-box.component.scss']
})
export class TouchPageBoxComponent implements OnInit, OnDestroy {

  @ViewChild('chatRef', { read: ElementRef }) chatRef!: ElementRef

  subs: Array<Subscription> = []

  stage: number = 0

  box: any = {
    size: { w: 300, h: 100, d: 300 }
  }

  menu: Array<OptionMenu> = []

  baseUrl: string = 'tebe.app'
  exampleUrl: string = this.locationService.translate('for-my-beloved-daughter-alice', 'маша-лови-подарок')

  general: any = {
    id: null,
    link: null,
    code: null,
    exp: new Date(Date.now()+4*24*60*60*1000)
  }

  copyAnimationName: string = ''

  searchImage: any = { w: 390, h: 68 }

  chat: any = {
    animate: false,
    margin: -1000
  }

  flagDbl: boolean = false
  timeoutDbl = setTimeout(() => {}, 0)

  public valerror: string = ''
  public timeoutError: any = setTimeout(() => {}, 0)

  // fullPathControl: FormControl = new FormControl('')

  public touches: any = {
    linkPreview: null,
    link: null,
    chat: null,
    main: null
  }

  public disableds: any = {
    linkPreview: true,
    link: true,
    chat: true,
    main: true
  }

  public stats: any = {
    linkPreview: 'close',
    link: 'close',
    chat: 'close',
    main: 'close'
  }

  public renameMax: number = 40
  public renameMin: number = 7
  public renameWhat: string = ''
  public renameValue: string = `${this.baseUrl}/${this.randomString(8)}`

  constructor(
    private touchService: TouchService,
    public locationService: LocationService,
    private asyncService: AsyncService,
    private router: Router,
    private backendService: BackendService
  ) { }

  @HostListener('window:resize') onResize(): void {
    this.setSizeSearchImage()
  }

  setStage1(): void {
    this.stage = 1
    this.showScreen('linkPreview')
  }

  setStage2(): void {
    this.stage = 2
    this.closeScreen('linkPreview')
    this.showScreen('link')
  }

  setStage3(): void {
    this.stage = 3
    this.closeScreen('link')
    this.showScreen('chat')
    this.chat.margin = -1000
    setTimeout(() => {
      this.animateChat()
    }, 0)
    
  }

  setStage4(): void {
    this.stage = 4
    this.closeScreen('chat')
    this.showScreen('main')
    this.setMenuMain()
  }

  setMenuMain(): void {
    this.menu = [
      {
        title: this.locationService.translate('look inside', 'посмотреть внутрь'),
        ico: '../../assets/eye.svg',
        value: 'review'
      }, {
        title: this.locationService.translate('copy link', 'скопировать ссылку'),
        ico: '../../assets/copy.svg',
        value: 'copyLink'
      }
    ]

    if (this.general.code) {
      this.menu.push({
        title: this.locationService.translate('copy code', 'скопировать код'),
        ico: '../../assets/password.svg',
        value: 'copyCode'
      })
    }
  }

  async showError(err: string): Promise<void> {
    clearTimeout(this.timeoutError)
    this.valerror = ''
    await this.asyncService.delay(250)
    this.valerror = err
    this.timeoutError = setTimeout(() => {
      this.valerror = ''
    }, 5000)
    return new Promise(res => res())
  }

  getExpareString(): string {
    const exp = this.general.exp

    const weeks = (exp.getTime()-new Date().getTime())/(7*24*60*60*1000)
    const days = (exp.getTime()-new Date().getTime())/(24*60*60*1000)
    const hours = (exp.getTime()-new Date().getTime())/(60*60*1000)
    const minutes = (exp.getTime()-new Date().getTime())/(60*1000)
    const seconds = (exp.getTime()-new Date().getTime())/(1000)

    const weekWord = this.locationService.translate('weeks', 'нед.')
    const daysWord = this.locationService.translate('days', 'сутк.')
    const hoursWord = this.locationService.translate('hours', 'ч.')
    const minutesWord = this.locationService.translate('minutes', 'мин.')
    const secondsWord = this.locationService.translate('seconds', 'сек.')

    if (exp.getTime()-new Date().getTime() < 0) {
      return this.locationService.translate('link is not active', 'ссылка не активна')
    } else if (weeks >= 1) {
      return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(weeks)} ${weekWord}`
    } else if (days >= 1) {
      return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(days)} ${daysWord}`
    } else if (hours >= 1) {
      return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(hours)} ${hoursWord}`
    } else if (minutes >= 1) {
      return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(minutes)} ${minutesWord}`
    } else {
      return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(seconds)} ${secondsWord}`
    }

    return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(days)} ${daysWord}`
  }

  async animateChat(): Promise<void> {
    const margin = 20

    const timeBetween = 1000

    const el = this.chatRef.nativeElement
    const messages = el.querySelectorAll('.chat__message')
    const rects = [...messages].map((e: any) => e.getBoundingClientRect())

    this.chat.animated = false

    await this.asyncService.delay(10)

    this.chat.margin = -rects.reduce((acc: number, curr: any) => acc+curr.height+margin, 0)

    await this.asyncService.delay(10)

    this.chat.animated = true

    await this.asyncService.delay(10)

    this.chat.margin += margin/2

    const length = this.backendService.code ? rects.length : rects.length-1

    for (let i = 0; i < length; i++) {

      this.chat.margin += rects[i].height+margin

      await this.asyncService.delay(timeBetween)
    }

    await this.asyncService.delay(300)

    return new Promise(res => res())
  }

  randomString(length: number) {
    let result = ''
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random()*chars.length))
    }
    return result
  }

  setSizeSearchImage(): void {
    const margin = 20
    const ratio: number = 390/68

    this.searchImage.w = window.innerWidth-2*margin
    this.searchImage.h = this.searchImage.w/ratio
  }

  closeScreen(type: string): void {
    this.disableds[type] = true
    this.stats[type] = 'close'
  }

  showScreen(type: string): void {
    this.disableds[type] = false
    this.stats[type] = 'open'
  }

  ruleLink(value: string): true | string {
    if (!/^[a-zа-я0-9\-]*$/g.test(value)) {
      return this.locationService.translate('only lower case of latin and russian letters or numbers or symbol "-"', 'только нижний регистр из латинских и русских букв или цифр или символ "-"')
    }
    return true
  }

  // screenLinkWasClosed(): void {
  //   if (this.stats.link === 'close') return

  //   this.setStage

  //   this.closeScreen('link')
  //   this.showScreen('')
  // }

  screenLinkWasSaved(value: string): void {
    this.general.link = value
    this.setStage3()
  }

  actionMenu(act: string): void {
    // console.log(act)
  }

  menuWasChoosen(option: string): void {
    // console.log(option)
    if (option === 'copyLink') {
      this.copyLink()
    } else if (option === 'copyCode') {
      this.copyCode()
    } else if (option === 'review') {
      this.router.navigateByUrl(`/v/${this.general.link}`)
    }
    
  }

  async showAnimationCopy(): Promise<void> {

    this.copyAnimationName = 'copyAnimation'

    await this.asyncService.delay(200)

    this.copyAnimationName = ''

    return new Promise(res => res())
  }

  copyLink(): void {
    navigator.clipboard.writeText(`https://${this.baseUrl}/v/${this.general.link}`).then(
      () => {
        // this.showAnimationCopy()
        this.showError(this.locationService.translate('link copied', 'ссылка скопирована'))
      },
      (err) => {
        
      }
    )
  }

  copyCode(): void {
    navigator.clipboard.writeText(`${this.general.code}`).then(
      () => {
        this.showError(this.locationService.translate('code copied', 'код скопирован'))
      },
      (err) => {
        
      }
    )
  }

  processTouch(t: Touch): void {
    Object.entries(this.disableds).forEach(([k, v]) => {
      if (!v) this.touches[k] = t
    })

    if (t.action === 'end' && t.drag === false && this.stage === 1) {
      this.setStage2()
    } else if (t.action === 'end' && t.drag === false && this.stage === 3) {
      this.setStage4()
    } else if (this.stage === 4) {
      // if (t.action === 'end') {
      //   if (this.flagDbl) {
      //     this.flagDbl = false
      //     clearTimeout(this.timeoutDbl)
      //     this.copyLink()
      //   } else if (!this.flagDbl) {
      //     this.flagDbl = true
      //     this.timeoutDbl = setTimeout(() => {
      //       this.flagDbl = false
      //     }, 200)
      //   }
      // }
    }

  }

  getBox(): void {
    const path = this.router.url
    const id = parseInt(path.split('?')[0].split('/')[2])

    this.backendService.getBoxGeneral(id).then((response: any) => {

      if (!response.success || !response.result) return

      this.box = {
        ...this.box,
        package: `${this.backendService.getLinkFromBackend(response.result.link_package)}`,
        tape: `${this.backendService.getLinkFromBackend(response.result.link_tape)}`
      }

      this.setStage3()

      this.general.id = id
      this.general.link = response.result.link
      this.general.code = this.backendService.code || ''
      this.general.exp = new Date(new Date(response.result.date).getTime()+7*24*60*60*1000)

      // if (!response.result.link) {
      //   this.setStage(1)
      // } else {
      //   this.general.id = id
      //   this.general.link = response.result.link
      //   this.general.code = this.backendService.code || ''
      //   this.general.exp = new Date(new Date(response.result.date).getTime()+7*24*60*60*1000)
      //   this.setStage(2)
      // }

    })
  }

  ngOnInit(): void {

    this.getBox()

    // this.box = JSON.parse(window.localStorage.getItem('box') || '{}')

    // this.setSizeSearchImage()

    // this.setStage3()

    // if (this.general.link) {
    //   this.setStage3()
    // } else {
    //   this.setStage1()
    // }
    
    // setTimeout(() => {
    //   this.setStage1()
    // }, 0)
    
    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )

  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

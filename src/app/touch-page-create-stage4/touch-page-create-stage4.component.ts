import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core'
import { Router } from '@angular/router'
import { ConfirmService } from '../services/confirm.service'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'
import { FormControl } from '@angular/forms'
import { TouchService, Touch } from '../touch.service'
import { BackendService } from '../services/backend.service'

@Component({
  selector: 'app-touch-page-create-stage4',
  templateUrl: './touch-page-create-stage4.component.html',
  styleUrls: ['./touch-page-create-stage4.component.scss']
})
export class TouchPageCreateStage4Component implements OnInit, OnDestroy {

  @Output() changeGlobalStage: EventEmitter<number> = new EventEmitter<number>()

  subs: Array<Subscription> = []

  public valerror: string = ''
  public timeoutError: any = setTimeout(() => {}, 0)

  linkBox: string = ''

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

  stage: number = 0

  searchImage: any = { w: 390, h: 68 }

  baseUrl: string = 'tebe.app'
  exampleUrl: string = this.locationService.translate('for-my-beloved-daughter-alice', 'маша-лови-подарок')

  public touches: any = {
    linkPreview: null,
    link: null,
    chooseNext: null
  }

  public disableds: any = {
    linkPreview: true,
    link: true,
    chooseNext: true
  }

  public stats: any = {
    linkPreview: 'close',
    link: 'close',
    chooseNext: 'close'
  }

  confirm: any = {
    value: '',
    type: ''
  }

  doscrolltocenterNextChoose: boolean = false

  cost: any = {}

  gifts: Array<any> = []

  public renameMax: number = 40
  public renameMin: number = 7
  public renameWhat: string = ''
  public renameValue: string = `${this.baseUrl}/${this.randomString(8)}`

  constructor(
    private touchService: TouchService,
    private asyncService: AsyncService,
    public locationService: LocationService,
    public host: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private confirmService: ConfirmService,
    public backendService: BackendService
  ) { }

  @HostListener('window:resize') onResize(): void {
    this.setSizeSearchImage()
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

  setStage1(): void {
    this.stage = 1
    this.showScreen('linkPreview')
  }

  setStage2(): void {
    this.stage = 2
    this.closeScreen('linkPreview')
    this.closeScreen('chooseNext')
    this.showScreen('link')
  }

  setStage3(): void {
    this.stage = 3
    this.closeScreen('link')
    this.showScreen('chooseNext')
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

  async ruleLink(value: string): Promise<true | string> {
    let answer: true | string = true

    if (value.length < 7) {
      answer = this.locationService.translate('minimum 7 characters, if you want less, it\'s paid. You can write to my tg: t.me/gaiusdedeo', 'минимум 7 символов, хотите меньше - это платно. Можете написать создателю этой темы в тг: t.me/gaiusdedeo')
    } else if (!/^[a-zа-я0-9\-]*$/g.test(value)) {
      answer = this.locationService.translate('only lower case of latin and russian letters or numbers or symbol "-"', 'только нижний регистр из латинских и русских букв или цифр или символ "-"')
    } else {
      const response = await this.backendService.checkLinkBox(value)

      if (!response.success) answer = this.locationService.translate('server error', 'ошибка сервера')

      if (response.result) {
        answer = this.locationService.translate('occupied', 'занято')
      }
    }

    return new Promise(res => res(answer))
  }

  showConfirm(type: string, text: string): void {
    this.confirm.value = text
    this.confirm.type = type
  }

  resultConfirm(res: any) {
    if (res === 'agree' && this.confirm.type === 'createBox') {
      this.createBox()
    } else if (res === 'reject' && this.confirm.type === 'createBox') {
      // this.setStage3()
      this.showScreen('chooseNext')
    }

    this.confirm.value = ''
    this.confirm.type = ''
  }

  randomString(length: number) {
    let result = ''
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random()*chars.length))
    }
    return result
  }

  closeScreenChooseNext(): void {
    // this.closeScreen('chooseNext')

    if (this.stage === 3 && !this.confirm.value) {
      this.setStage2()
    }
  }

  screenLinkWasSaved(value: string): void {
    console.log(value)
    this.linkBox = value
    this.box.link = this.linkBox
    this.setStage3()
    this.doscrolltocenterNextChoose = !this.doscrolltocenterNextChoose
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

  createBox(): void {
    // this place

    const box = {
      ...this.box,
      costPrice: this.cost.price,
      costType: this.cost.type,
      costRate: this.cost.rate,
      costCurrency: this.cost.currency
    }

    this.backendService.createBox(box, this.gifts).then(response => {

      if (!response.success) return

      const id = response.result.id
      this.backendService.code = response.result.code

      // window.localStorage.removeItem('box')
      // window.localStorage.removeItem('gifts')
      // window.localStorage.removeItem('cost')

      this.router.navigateByUrl(`/i/${id}`)

    })
  }

  processTouch(t: Touch): void {
    Object.entries(this.disableds).forEach(([k, v]) => {
      if (!v) this.touches[k] = t
    })

    if (t.action === 'end' && t.drag === false && this.stage === 1) {
      this.setStage2()
    } else if (this.stage === 3) {
      if (this.stats.chooseNext === 'open') {
        if (t.action === 'end' && t.drag === false) {
          const el1 = this.getEscalateDOM(t.target, 'button-back')
          const el2 = this.getEscalateDOM(t.target, 'button-forward')

          if (el1) {
            this.changeGlobalStage.emit(3)
          } else if (el2) {
            this.closeScreen('chooseNext')
            setTimeout(() => {
              this.showConfirm('createBox', this.locationService.translate('If you complete it, you will never be able to edit the gift again, you will have to delete it and create it again. Sure?', 'Если вы завершите, вы больше никогда не сможете отредактировать подарок, придётся удалять и заного создавать. Уверены?'))
            }, 10)
          }

        }
      }
    }

  }

  ngOnInit(): void {

    this.cost = JSON.parse(window.localStorage.getItem('cost') || '{}')

    this.gifts = JSON.parse(window.localStorage.getItem('gifts') || '[]')
    this.box = { ...this.box, ...JSON.parse(window.localStorage.getItem('box') || '{}') }
    
    this.setSizeSearchImage()

    this.setStage1()

    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )

  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

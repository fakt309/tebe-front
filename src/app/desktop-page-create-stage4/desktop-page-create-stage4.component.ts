import { Component, ViewContainerRef, OnInit, HostListener, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { trigger, state, transition, style, animate } from '@angular/animations'
import { LocationService } from '../services/location.service'
import { Router } from '@angular/router'
import { debounceTime, map } from 'rxjs'
import { BackendService } from '../services/backend.service'
import { AsyncService } from '../async.service'
import { FormControl } from '@angular/forms'
import { ConfirmService } from '../services/confirm.service'
import { GetTargetHtmlService } from '../services/get-target-html.service'

@Component({
  selector: 'app-desktop-page-create-stage4',
  templateUrl: './desktop-page-create-stage4.component.html',
  styleUrls: ['./desktop-page-create-stage4.component.scss']
})
export class DesktopPageCreateStage4Component implements OnInit, AfterViewInit {

  @ViewChild('completeRef', { read: ElementRef }) completeRef!: ElementRef

  @Output() changeGlobalStage: EventEmitter<number> = new EventEmitter<number>()

  stage: number = 0

  gifts: Array<any> = []

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

  cost: any = {}

  baseUrl: string = 'tebe.app'
  exampleUrl: string = this.locationService.translate('for-my-beloved-daughter-alice', 'маша-лови-подарок')

  searchImage: any = { w: 390, h: 68 }

  linkControl: FormControl = new FormControl('')

  textError: string = ''
  timeoutError = setTimeout(() => {}, 0)

  showMyContantErrorLink: boolean = false

  general: any = {
    id: null,
    link: null,
    code: null,
    exp: new Date(Date.now()+4*24*60*60*1000)
  }

  constructor(
    public locationService: LocationService,
    public asyncService: AsyncService,
    private router: Router,
    private backendService: BackendService,
    private confirmService: ConfirmService,
    private getTargetHtmlService: GetTargetHtmlService,
    private hostContainer: ViewContainerRef
  ) { }

  @HostListener('window:resize') onResize(): void {
    this.setSizeSearchImage()
  }

  async createBox(): Promise<void> {

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

      window.localStorage.removeItem('box')
      window.localStorage.removeItem('gifts')
      window.localStorage.removeItem('cost')

      this.router.navigateByUrl(`/i/${id}`)

    })

    return new Promise(res => res())
  }

  async onClickCreateBox(e: any): Promise<void> {
    if (this.linkControl.errors !== null) return new Promise(res => res())

    const el = this.getTargetHtmlService.get(e.target, 'preview__button')

    this.confirmService.show(
      this.hostContainer,
      el!,
      this.locationService.translate('If you complete it, you will never be able to edit the gift again, you will have to delete it and create it again. Sure?', 'Если вы завершите, вы больше никогда не сможете отредактировать подарок, придётся удалять и заного создавать. Уверены?'),
      (res: boolean): void => {
        if (res) {
          this.createBox()
        }
        this.confirmService.hide()
    })

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

  setStage(stage: number): void {
    this.stage = stage
  }

  setSizeSearchImage(): void {
    const maxWidth = 600
    const margin = 20
    const ratio: number = 390/68

    this.searchImage.w = window.innerWidth-2*margin
    if (this.searchImage.w > maxWidth-2*margin) this.searchImage.w = maxWidth-2*margin
    this.searchImage.h = this.searchImage.w/ratio
  }

  validLink(value: string): true | string {
    if (value.length < 7) {
      return this.locationService.translate('minimum length 7 characters', 'минимальная длина 7 символов')
    } else if (!/^[a-zа-я0-9\-]*$/g.test(value)) {
      return this.locationService.translate('only lower case of latin and russian letters or numbers or symbol "-"', 'только нижний регистр из латинских и русских букв или цифр или символ "-"')
    }

    this.general.link = this.linkControl.value

    return true
  }

  ngAfterViewInit(): void {
    this.setStage(1)
  }

  ngOnInit(): void {

    this.cost = JSON.parse(window.localStorage.getItem('cost') || '{}')

    this.gifts = JSON.parse(window.localStorage.getItem('gifts') || '[]')
    this.box = { ...this.box, ...JSON.parse(window.localStorage.getItem('box') || '{}') }

    this.linkControl.valueChanges
      .pipe(
        map(x => {
          this.showMyContantErrorLink = false
          this.linkControl.setErrors({ type: 'loading', text: '' })
          return x
        }),
        debounceTime(300)
      ).subscribe((value: string) => {

        if (value.length < 7) {
          this.showMyContantErrorLink = true
          this.linkControl.setErrors({
            type: 'validate',
            text: this.locationService.translate('minimum 7 characters, if you want less, it\'s paid. You can write to me: ', 'минимум 7 символов, хотите меньше - это платно. Можете написать создателю этой темы: ')
          })
        } else if (!/^[a-zа-я0-9\-]*$/g.test(value)) {
          this.linkControl.setErrors({
            type: 'validate',
            text: this.locationService.translate('only lower case of latin and russian letters or numbers or symbol "-"', 'только нижний регистр из латинских и русских букв или цифр или символ "-"')
          })
        } else {
          this.backendService.checkLinkBox(value).then(response => {
            if (!response.success) return

            if (response.result) {
              this.linkControl.setErrors({
                type: 'occupied',
                text: this.locationService.translate('occupied', 'занято')
              })
            } else {
              this.linkControl.setErrors(null)
              this.box.link = this.linkControl.value
            }

          })
        }

        
      })

    this.linkControl.setValue('')

    this.setSizeSearchImage()

  }

}

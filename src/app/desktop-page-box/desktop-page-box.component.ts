import { Component, OnInit, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { LocationService } from '../services/location.service'
import { FormControl } from '@angular/forms'
import { AsyncService } from '../async.service'
import { ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { BackendService } from '../services/backend.service'
import { debounceTime, map } from 'rxjs'

@Component({
  selector: 'app-desktop-page-box',
  templateUrl: './desktop-page-box.component.html',
  styleUrls: ['./desktop-page-box.component.scss']
})
export class DesktopPageBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('chatRef', { read: ElementRef }) chatRef!: ElementRef

  stage: number = 0

  baseUrl: string = 'tebe.app'
  exampleUrl: string = this.locationService.translate('for-my-beloved-daughter-alice', 'маша-лови-подарок')

  searchImage: any = { w: 390, h: 68 }

  linkControl: FormControl = new FormControl('')

  textError: string = ''
  timeoutError = setTimeout(() => {}, 0)

  chat: any = {
    animate: false,
    margin: 10
  }

  box: any = {
    size: { w: 300, h: 100, d: 300 }
  }

  showMyContantErrorLink: boolean = false

  general: any = {
    id: null,
    link: null,
    code: null,
    exp: new Date(Date.now()+4*24*60*60*1000)
  }

  copies = {
    copy1AnimateName: 'none',
    copy2AnimateName: 'none'
  }

  constructor(
    public locationService: LocationService,
    public asyncService: AsyncService,
    public changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private backendService: BackendService
  ) { }

  @HostListener('window:resize') onResize(): void {
    this.setSizeSearchImage()
  }

  goToView(): void {
    this.router.navigateByUrl(`/v/${this.general.link}`)
  }

  onClickCopy(index: number): void {
    if (index === 0) {
      this.copies.copy1AnimateName = 'copyAnimation'
      this.copyCode()
    } else if (index === 1) {
      this.copies.copy2AnimateName = 'copyAnimation'
      this.copyLink()
    }

    setTimeout(() => {
      this.copies.copy1AnimateName = 'none'
      this.copies.copy2AnimateName = 'none'
    }, 1000)
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

    if (stage === 2) {
      this.animateChat()
    }
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

  // sendLinkGift(): void {
  //   const link = this.linkControl.value
  //   if (this.validLink(link) !== true) {
  //     this.showError(this.locationService.translate('the link is incorrect', 'ссылка некорректная'))
  //     return
  //   }

  //   const path = this.router.url
  //   const id = parseInt(path.split('?')[0].split('/')[2])

  //   this.backendService.setLinkBox(id, this.linkControl.value).then(response => {
  //     if (!response.success) return

  //     this.setStage(2)
  //   })

  // }

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

    const length = this.general.code ? rects.length : rects.length-1

    for (let i = 0; i < length; i++) {

      this.chat.margin += rects[i].height+margin

      await this.asyncService.delay(timeBetween)
    }

    await this.asyncService.delay(300)

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

    // if (exp.getTime()-new Date().getTime() < 0) {
    //   return this.locationService.translate('link is not active', 'ссылка не активна')
    // } else if (weeks >= 1) {
    //   return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(weeks)} ${weekWord}`
    // } else if (days >= 1) {
    //   return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(days)} ${daysWord}`
    // } else if (hours >= 1) {
    //   return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(hours)} ${hoursWord}`
    // } else if (minutes >= 1) {
    //   return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(minutes)} ${minutesWord}`
    // } else {
    //   return `${this.locationService.translate('the link will become inactive in ', 'ссылка еще действительна ')} ${Math.round(seconds)} ${secondsWord}`
    // }

    if (exp.getTime()-new Date().getTime() < 0) {
      return this.locationService.translate('the gift was destroyed', 'подарок удалён')
    } else if (weeks >= 1) {
      return `${this.locationService.translate('the gift will be deleted after ', 'подарок удалится через ')} ${Math.round(weeks)} ${weekWord}`
    } else if (days >= 1) {
      return `${this.locationService.translate('the gift will be deleted after ', 'подарок удалится через ')} ${Math.round(days)} ${daysWord}`
    } else if (hours >= 1) {
      return `${this.locationService.translate('the gift will be deleted after ', 'подарок удалится через ')} ${Math.round(hours)} ${hoursWord}`
    } else if (minutes >= 1) {
      return `${this.locationService.translate('the gift will be deleted after ', 'подарок удалится через ')} ${Math.round(minutes)} ${minutesWord}`
    } else {
      return `${this.locationService.translate('the gift will be deleted after ', 'подарок удалится через ')} ${Math.round(seconds)} ${secondsWord}`
    }

    return `${this.locationService.translate('the gift will be deleted after ', 'подарок удалится через ')} ${Math.round(days)} ${daysWord}`
  }


  getBox(): void {
    const path = this.router.url
    const id = parseInt(path.split('?')[0].split('/')[2])

    this.backendService.getBoxGeneral(id).then((response: any) => {

      console.log(response)

      if (!response.success || !response.result) return

      this.box = {
        ...this.box,
        package: `${this.backendService.getLinkFromBackend(response.result.link_package)}`,
        tape: `${this.backendService.getLinkFromBackend(response.result.link_tape)}`
      }

      if (!response.result.link) {
        this.setStage(1)
      } else {
        this.general.id = id
        this.general.link = response.result.link
        this.general.code = this.backendService.code || ''
        this.general.exp = new Date(new Date(response.result.date).getTime()+7*24*60*60*1000)
        this.setStage(2)
      }

    })
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {this.setStage(1)}, 300)

    this.changeDetectorRef.detectChanges()
  }

  ngOnInit(): void {

    this.getBox()

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
            }

          })
        }

        
      })

    this.linkControl.setValue('')

    // this.setSizeSearchImage()

  }

}

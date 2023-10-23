import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core'
import { TouchService, Touch } from '../touch.service'
import { Subscription } from 'rxjs'
import { LocationService } from '../services/location.service'
import { trigger, transition, style, animate, query } from '@angular/animations'

@Component({
  selector: 'app-touch-page-create-stage2',
  templateUrl: './touch-page-create-stage2.component.html',
  styleUrls: ['./touch-page-create-stage2.component.scss'],
  animations: [
    trigger('slideShow', [
      transition(':enter', [
        query('.stage2-question', [
          style({ transform: 'translateY(-2000px)' })
        ]),
        query('.stage2-answers', [
          style({ transform: 'translateY(-2000px)' })
        ]),
        query('.stage2-question', [
          animate('2s ease', style({ transform: 'translateY(-50px)' }))
        ]),
        query('.stage2-answers', [
          animate('2s ease', style({ transform: 'translateY(0px) ' }))
        ])
      ])
    ])
  ]
})
export class TouchPageCreateStage2Component implements OnInit, OnDestroy {

  private subs: Array<Subscription> = []

  constructor(
    private touchService: TouchService,
    public locationService: LocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  @HostListener('window:touchend') onTouchend():void {
    if (this.stats.hint === 'open' && this.disableds['hint']) this.disableds['hint'] = false
  }

  @HostListener('window:touchcancel') onTouchcancel():void {
    if (this.stats.hint === 'open' && this.disableds['hint']) this.disableds['hint'] = false
  }

  public call: any = {
  }

  public touches: any = {
    showPrice: null,
    hintNo: null,
    hintYes: null,
    hint: null,
    currency: null,
    currencyName: null,
    currencyRate: null,
    currencyValue: null,
    currencySlide: null
  }

  public stats: any = {
    showPrice: 'close',
    hintNo: 'close',
    hintYes: 'close',
    hint: 'close',
    currency: 'close',
    currencyName: 'close',
    currencyRate: 'close',
    currencyValue: 'close',
    currencySlide: 'close'
  }

  public disableds: any = {
    showPrice: true,
    hintNo: true,
    hintYes: true,
    hint: true,
    currency: true,
    currencyName: true,
    currencyRate: true,
    currencyValue: true,
    currencySlide: true
  }

  public wasChoosen: any = {
    showPrice: false,
    hintNo: false,
    hintYes: false,
    currency: false
  }

  public howShowPrice: 'notAtAll' | 'hint' | 'exact' = 'notAtAll'
  public firstChoose: 'no' | 'yes' = 'no'

  public otherCurrency: boolean = false

  public activeCoin: number = 0
  public typesCoin: Array<string> = ['dollar', 'euro', 'ruble', 'yen', 'pound']
  public coins: Array<any> = []
  public intervalCoins: any = setTimeout(() => {}, 0)

  public doscrolltocenter: boolean = false

  public currency: any = {
    id: '',
    name: '',
    rate: 1,
    sign: '',
    value: 0,
    active: 0,
    options: []
  }

  @ViewChild('moneyRef') moneyRef!: ElementRef

  processTouch(t: Touch): void {
    Object.entries(this.disableds).forEach(([k, v]) => {
      if (!v) this.touches[k] = t
    })
  }

  onCloseScreen(type: string): void {
    this.disableds[type] = true
    this.stats[type] = 'close'

    if (type === 'showPrice' && !this.wasChoosen['showPrice']) {
      console.log("BACK")
    } else if (type === 'hintNo' && !this.wasChoosen['hintNo']) {
      this.showScreen('showPrice')
    } else if (type === 'hintYes' && !this.wasChoosen['hintYes']) {
      this.showScreen('showPrice')
    } else if (type === 'currency' && !this.wasChoosen['currency']) {
      if (this.firstChoose === 'yes') {
        this.showScreen('hintYes')
      } else if (this.firstChoose === 'no') {
        this.showScreen('hintNo')
      }
    } else if (type === 'currencyValue' && !this.wasChoosen['currencyValue']) {
      if (this.howShowPrice === 'exact' && !this.otherCurrency) {
        this.showScreen('currency')
      } else if (this.howShowPrice === 'exact' && this.otherCurrency) {
        this.showScreen('currencyRate')
      }
    } else if (type === 'currencyName' && !this.wasChoosen['currencyName']) {
      if (this.howShowPrice === 'exact' || this.howShowPrice === 'hint') {
        this.showScreen('currency')
      }

      this.otherCurrency = false
    } else if (type === 'currencyRate' && !this.wasChoosen['currencyRate']) {
      if (this.howShowPrice === 'exact' || this.howShowPrice === 'hint') {
        this.showScreen('currencyName')
      }
    } else if (type === 'currencySlide' && !this.wasChoosen['currencySlide']) {
      if (this.howShowPrice === 'hint' && !this.otherCurrency) {
        this.showScreen('currency')
      } else if (this.howShowPrice === 'hint' && this.otherCurrency) {
        this.showScreen('currencyRate')
      }
    }

    this.wasChoosen[type] = false

    this.changeDetectorRef.detectChanges()
  }

  showScreen(type: string): void {
    this.disableds[type] = false
    this.stats[type] = 'open'

    if (type === 'currencySlide') {
      setTimeout(() => {
        this.doscrolltocenter = !this.doscrolltocenter
      }, 0)
    }
  }

  chooseCurrency(curr: string): void {
    this.wasChoosen['currency'] = true
    this.stats['currency'] = 'close'

    if (curr === 'other') {
      this.otherCurrency = true
      this.showScreen('currencyName')
    } else {
      this.currency.id = curr
      this.currency.name = this.currencyName(curr)
      this.currency.sign = this.coinContent(curr)
      this.currency.rate = this.currencyRate(curr)
      this.currency.options = this.currencyOption(curr)

      if (this.howShowPrice === 'hint') {
        this.showScreen('currencySlide')
      } else if (this.howShowPrice === 'exact') {
        this.showScreen('currencyValue')
      }
    }
  }

  currencyOption(type: string): Array<number> {
    if (type === 'dollar') return [0, 0, 10, 50, 100, 500, 1000, 10000, 100000]
    if (type === 'euro') return [0, 0, 10, 50, 100, 500, 1000, 10000, 100000]
    if (type === 'ruble') return [0, 0, 10*100, 50*100, 100*100, 500*100, 1000*100, 10000*100, 100000*100]
    if (type === 'yen') return [0, 0, 10*150, 50*150, 100*150, 500*150, 1000*150, 10000*150, 100000*150]
    if (type === 'pound') return [0, 0, 10, 50, 100, 500, 1000, 10000, 100000]
    return [0*this.currency.rate, 0*this.currency.rate, 10*this.currency.rate, 50*this.currency.rate, 100*this.currency.rate, 500*this.currency.rate, 1000*this.currency.rate, 10000*this.currency.rate, 100000*this.currency.rate]
  }

  currencyName(type: string): string {
    if (this.locationService.location().country.code === 'ru') {
      if (type === 'dollar') return 'доллар'
      if (type === 'euro') return 'евро'
      if (type === 'ruble') return 'рубль'
      if (type === 'yen') return 'йена'
      if (type === 'pound') return 'фунт стерлингов'
    }
    return type
  }

  currencyRate(type: string): number {
    if (type === 'dollar') {
      return 1
    } else if (type === 'euro') {
      return 1
    } else if (type === 'ruble') {
      return 61
    } else if (type === 'yen') {
      return 147
    } else if (type === 'pound') {
      return 0.88
    }
    return 1
  }

  coinContent(type: string): string {
    if (type === 'dollar') {
      return '$'
    } else if (type === 'euro') {
      return '€'
    } else if (type === 'ruble') {
      return '₽'
    } else if (type === 'yen') {
      return '¥'
    } else if (type === 'pound') {
      return '£'
    }
    return '$'
  }

  resultShowPrice(res: boolean): void {
    this.wasChoosen['showPrice'] = true
    this.stats['showPrice'] = 'close'
    if (res) {
      this.showScreen('hintYes')
      this.firstChoose = 'yes'
    } else {
      this.showScreen('hintNo')
      this.firstChoose = 'no'
    }
  }

  resultHintNo(res: boolean): void {
    this.wasChoosen['hintNo'] = true
    this.stats['hintNo'] = 'close'
    if (res) {
      this.howShowPrice = 'hint'
      this.showScreen('currency')
    } else {
      this.howShowPrice = 'notAtAll'
      this.goToNextStage()
    }
  }

  resultHintYes(res: boolean): void {
    this.wasChoosen['hintYes'] = true
    this.stats['hintYes'] = 'close'
    if (res) {
      this.howShowPrice = 'hint'
      this.showScreen('currency')
      this.call.refreshCurrecy = !this.call.refreshCurrecy
    } else {
      this.howShowPrice = 'exact'
      this.showScreen('currency')
      this.call.refreshCurrecy = !this.call.refreshCurrecy
    }
  }

  formatLabelMoneyHint(value: number) {
    // if (this.typesCoin[this.activeCoin] === 'dollar') {
      if (value === 0) {
        return '< 10';
      } else if (value === 1) {
        return '10 < ... < 100';
      } else if (value === 2) {
        return '100 < ... < 1k';
      } else if (value === 3) {
        return '1k < ... < 10k';
      } else if (value === 4) {
        return '10k < ... < 100k';
      } else if (value === 5) {
        return '100k <';
      }
    // }


    return 'price < 10$';
  }

  onSaveCurrencyName(val: string): void {
    this.wasChoosen['currencyName'] = true
    this.stats['currencyName'] = 'close'
    this.currency.name = val
    this.currency.sign = val.slice(0, 1)
    if (this.howShowPrice === 'exact' || this.howShowPrice === 'hint') {
      this.showScreen('currencyRate')
    }
  }

  onSaveCurrencyRate(val: string): void {
    this.wasChoosen['currencyRate'] = true
    this.stats['currencyRate'] = 'close'
    let n = parseFloat(val)
    if (!n) n = 1
    this.currency.rate = Math.round(n*100)/100
    this.currency.options = [0*this.currency.rate, 0*this.currency.rate, 10*this.currency.rate, 50*this.currency.rate, 100*this.currency.rate, 500*this.currency.rate, 1000*this.currency.rate, 10000*this.currency.rate, 100000*this.currency.rate]
    if (this.howShowPrice === 'hint') {
      this.showScreen('currencySlide')
    } else if (this.howShowPrice === 'exact') {
      this.showScreen('currencyValue')
    }
  }

  onSaveCurrencyValue(val: string): void {
    this.wasChoosen['currencyValue'] = true
    this.stats['currencyValue'] = 'close'
    let n = parseFloat(val)
    if (!n) n = 1
    this.currency.value = Math.round(n*100)/100
    this.goToNextStage()
  }

  onSaveCurrencySlide(): void {
    console.log('catch close slide')
    this.wasChoosen['currencySlide'] = true
    this.stats['currencySlide'] = 'close'
    this.goToNextStage()
  }

  onInputCurrencyValue(val: string): void {
    this.currency.value = val
  }

  goToNextStage(): void {
    console.log('GO TO NEXT STAGE')
  }

  ngOnInit(): void {
    this.subs.push(
      this.touchService.stream$.subscribe((e: Touch) => { this.processTouch(e) })
    )

    let time = 200
    let timeLive = 2000

    clearInterval(this.intervalCoins)
    this.intervalCoins = setInterval(() => {
      let type = this.typesCoin[(Math.random()*this.typesCoin.length) | 0]
      this.coins.push({
        x: Math.random()*window.innerWidth,
        y: Math.random()*window.innerHeight,
        type,
        speed: Math.random()*10+1
      })
      this.coins.slice(-1*(Math.floor(timeLive/time)))
    }, time)

    setTimeout(() => {
      this.showScreen('showPrice')
    }, 100)
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
  }

}

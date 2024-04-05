import { Component, OnInit, OnDestroy, EventEmitter, Output, HostBinding } from '@angular/core'
import { trigger, state, transition, style, animate } from '@angular/animations'
import { LocationService } from '../services/location.service'
import { FormControl } from '@angular/forms'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-desktop-page-create-stage2',
  templateUrl: './desktop-page-create-stage2.component.html',
  styleUrls: ['./desktop-page-create-stage2.component.scss'],
  animations: [
    trigger('stageAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100vw)' }),
        animate('0.2s ease', style({ transform: 'translateY(0vw)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0vw)' }),
        animate('0.2s ease', style({ transform: 'translateY(100vw)' }))
      ])
    ])
  ]
})
export class DesktopPageCreateStage2Component implements OnInit, OnDestroy {

  @HostBinding('@stageAnimation') stageAnimation: string = ''

  @Output() changeGlobalStage: EventEmitter<number> = new EventEmitter<number>()

  subs: Array<Subscription> = []

  firstControl: FormControl = new FormControl('no')
  secondControl: FormControl = new FormControl('')
  thirdControl: FormControl = new FormControl(0)
  fourthControl: FormControl = new FormControl(0)
  fifthControl: FormControl = new FormControl(0)

  box: any = {}

  public activeCoin: number = 0
  public typesCoin: Array<string> = ['dollar', 'euro', 'ruble', 'yen', 'pound']
  public coins: Array<any> = []
  public intervalCoins: any = setTimeout(() => {}, 0)

  constructor(
    public locationService: LocationService
  ) { }

  initCoins(): void {
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

  currencyOption(type: string, rate: number): Array<number> {
    if (type === 'dollar') return [0, 0, 10, 50, 100, 500, 1000, 10000, 100000, 100000]
    if (type === 'euro') return [0, 0, 10, 50, 100, 500, 1000, 10000, 100000, 100000]
    if (type === 'ruble') return [0, 0, 10*100, 50*100, 100*100, 500*100, 1000*100, 10000*100, 100000*100, 100000*100]
    if (type === 'yen') return [0, 0, 10*150, 50*150, 100*150, 500*150, 1000*150, 10000*150, 100000*150, 100000*150]
    if (type === 'pound') return [0, 0, 10, 50, 100, 500, 1000, 10000, 100000, 100000]
    return [0*rate, 0*rate, 10*rate, 50*rate, 100*rate, 500*rate, 1000*rate, 10000*rate, 100000*rate, 100000*rate]
  }

  isDefaultSign(sign: string): boolean {
    if (sign === 'dollar' || sign === 'euro' || sign === 'ruble' || sign === 'yen' || sign === 'pound') {
      return true
    }
    return false
  }

  toBackStage(): void {
    this.changeGlobalStage.emit(1)
  }

  toNextStage(): void {
    this.changeGlobalStage.emit(3)
  }

  saveUpdate(): void {
    const type = this.firstControl.value
    const currency = type !== 'no' ? this.secondControl.value : null
    const rate = this.isDefaultSign(currency) ? null : this.thirdControl.value

    let price = null
    if (type === 'yes') {
      price = this.fourthControl.value
    } else if (type === 'hint') {
      const index = this.fifthControl.value
      const options = this.currencyOption(currency, rate || 1)
      price = [options[index], options[index+1] === options[index] && options[index+1] !== 0 ? 'infinity' : options[index+1]]
    }

    const cost = {
      type,
      currency,
      rate,
      price
    }

    console.log(cost)

    window.localStorage.setItem('cost', JSON.stringify(cost))

  }

  ngOnInit(): void {
    this.initCoins()

    this.subs.push(
      this.firstControl.valueChanges.subscribe((value: string) => {
        this.saveUpdate()
      })
    )

    this.subs.push(
      this.secondControl.valueChanges.subscribe((value: string) => {
        this.thirdControl.setValue(0)
        this.saveUpdate()
      })
    )

    this.subs.push(
      this.thirdControl.valueChanges.subscribe((value: string) => {
        this.saveUpdate()
      })
    )

    this.subs.push(
      this.fourthControl.valueChanges.subscribe((value: string) => {
        this.saveUpdate()
      })
    )

    this.subs.push(
      this.fifthControl.valueChanges.subscribe((value: string) => {
        this.saveUpdate()
      })
    )

  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

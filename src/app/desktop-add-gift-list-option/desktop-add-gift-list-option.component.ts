import { Component, OnInit, Input, HostListener, HostBinding, Output, EventEmitter, OnChanges } from '@angular/core'
import { trigger, state, style, animate, transition, query, stagger, group } from '@angular/animations'
import { exampleSignGreeting } from './example-sign-greeting-card'
import { exampleSignPhoto } from './example-sign-photo'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-desktop-add-gift-list-option',
  templateUrl: './desktop-add-gift-list-option.component.html',
  styleUrls: ['./desktop-add-gift-list-option.component.scss'],
  animations: [
    trigger('fadeScaleInfo', [
      transition(':enter', [
        style({ 'transform': 'translateY(110px) scale(0.2)', 'opacity': '0' }),
        animate('300ms ease', style({ 'transform': 'translateY(110px) scale(1)', 'opacity': '1' }))
      ]),
      transition(':leave', [
        animate('300ms ease', style({ 'transform': 'translateY(110px) scale(0.2)', 'opacity': '0' }))
      ])
    ]),
    trigger('fadeScaleButton1', [
      transition(':enter', [
        style({ 'transform': 'translateX(-70px) translateY(220px) scale(0.2)', 'opacity': '0' }),
        animate('300ms ease', style({ 'transform': 'translateX(-70px) translateY(220px) scale(1)', 'opacity': '1' }))
      ]),
      transition(':leave', [
        animate('300ms ease', style({ 'transform': 'translateX(-70px) translateY(220px) scale(0.2)', 'opacity': '0' }))
      ])
    ]),
    trigger('fadeScaleButton2', [
      transition(':enter', [
        style({ 'transform': 'translateX(70px) translateY(220px) scale(0.2)', 'opacity': '0' }),
        animate('300ms ease', style({ 'transform': 'translateX(70px) translateY(220px) scale(1)', 'opacity': '1' }))
      ]),
      transition(':leave', [
        animate('300ms ease', style({ 'transform': 'translateX(70px) translateY(220px) scale(0.2)', 'opacity': '0' }))
      ])
    ])
  ]
})
export class DesktopAddGiftListOptionComponent implements OnInit, OnChanges {

  @HostBinding('class.pointer') pointer: boolean = false

  @Output() add: EventEmitter<void> = new EventEmitter<void>()
  @Output() how: EventEmitter<void> = new EventEmitter<void>()

  @Input() type: string = ''
  @Input() descr: boolean = false

  public exampleSignGreeting: Array<any> = exampleSignGreeting
  public exampleSignPhoto: Array<any> = exampleSignPhoto

  constructor(
    public locationService: LocationService
  ) { }

  get title(): string {
    if (this.type === 'greetingcard') {
      return this.locationService.translate('Greeting card', 'Открытка')
    } else if (this.type === 'game') {
      return this.locationService.translate('Game', 'Видеоигра')
    } else if (this.type === 'speaker') {
      return this.locationService.translate('Audio', 'Колонка')
    } else if (this.type === 'tablet') {
      return this.locationService.translate('Video', 'Планшет')
    } else if (this.type === 'photo') {
      return this.locationService.translate('Photo', 'Фотография')
    }
    return ''
  }

  get description(): string {
    if (this.type === 'greetingcard') {
      return this.locationService.translate('Congratulate with a quatrain and sign with your own hand', 'Напишите поздравление в стихотворной форме и подпишите собственной рукой')
    } else if (this.type === 'game') {
      return this.locationService.translate('Buy a game redemption code and give it as a gift', 'Купите активационный ключ для игры и подарите игру')
    } else if (this.type === 'speaker') {
      return this.locationService.translate('Record your voice', 'Запишите свой голос с поздравлениями')
    } else if (this.type === 'tablet') {
      return this.locationService.translate('Record your video', 'Запишите видео на вебкамеру с поздравлениями')
    } else if (this.type === 'photo') {
      return this.locationService.translate('Take a photo', 'Сделайте фотографию и подпишите её собственной рукой')
    }
    return ''
  }

  ngOnInit(): void { }

  ngOnChanges(): void {
    this.pointer = !this.descr
  }

}

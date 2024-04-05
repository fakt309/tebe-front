import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, HostBinding } from '@angular/core'
import { FormControl } from '@angular/forms'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-desktop-lock',
  templateUrl: './desktop-lock.component.html',
  styleUrls: ['./desktop-lock.component.scss'],
  animations: [
    trigger('codeNumber', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: '0' }),
        animate('0.2s ease', style({ transform: 'scale(1)', opacity: '1' }))
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: '1' }),
        animate('0.2s ease', style({ transform: 'scale(0)', opacity: '0' }))
      ])
    ])
  ]
})
export class DesktopLockComponent implements OnInit {

  // alphabet: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  subs: Array<Subscription> = []

  codeControl: FormControl = new FormControl('')

  max: number = 4

  codeCorrect: boolean = false

  @HostBinding('class.disabled') @Input() disabled: boolean = false
  @Input() toReject: EventEmitter<void> = new EventEmitter<void>()
  @Input() toAccept: EventEmitter<void> = new EventEmitter<void>()
  @Input() toInput: EventEmitter<void> = new EventEmitter<void>()

  @Output() input: EventEmitter<string> = new EventEmitter<string>()

  @HostBinding('style.animation-name') animationNameHost: string = ''

  constructor(
    private asyncService: AsyncService
  ) { }

  addNumber(n: number): void {
    if (this.disabled) return

    if (this.codeControl.value.length < this.max) {
      this.codeControl.setValue(`${this.codeControl.value}${n}`)
    }
  }

  deleteLastNumber(): void {
    if (this.disabled) return

    if (this.codeControl.value.length > 0) {
      this.codeControl.setValue(this.codeControl.value.slice(0, -1))
    }
  }

  getCodeChar(index: number): string {
    return this.codeControl.value[index] || ''
  }

  async checkCode(): Promise<void> {
    if (this.disabled) return new Promise(res => res())

    this.input.emit(this.codeControl.value)

    return new Promise(res => res())
  }

  async animateReject(): Promise<void> {
    if (this.disabled) return new Promise(res => res())

    this.animationNameHost = 'reject'
    await this.asyncService.delay(300)
    this.animationNameHost = ''

    return new Promise(res => res())
  }

  async animateAccept(): Promise<void> {
    if (this.disabled) return new Promise(res => res())

    this.codeCorrect = true

    return new Promise(res => res())
  }

  ok(): void {
    if (this.disabled) return

    this.input.emit(this.codeControl.value)
  }

  ngOnInit(): void {

    this.subs.push(
      this.toReject.subscribe(() => {
        this.animateReject()
      })
    )

    this.subs.push(
      this.toAccept.subscribe(() => {
        this.animateAccept()
      })
    )

    this.subs.push(
      this.toInput.subscribe(() => {
        this.checkCode()
      })
    )

  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

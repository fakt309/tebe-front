import { Component, OnInit, OnDestroy, AfterViewInit, Input, forwardRef, HostListener, ElementRef, ViewChild } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms'
import { LocationService } from '../services/location.service'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-desktop-input-number',
  templateUrl: './desktop-input-number.component.html',
  styleUrls: ['./desktop-input-number.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DesktopInputNumberComponent),
    multi: true
  }]
})
export class DesktopInputNumberComponent implements OnInit {

  @Input() postfix: string = ''

  subs: Array<Subscription> = []

  control: FormControl = new FormControl('')

  value: string = ''

  changeFunc!: Function
  touchFunc!: Function

  constructor(
    private asyncService: AsyncService,
    private host: ElementRef
  ) { }

  writeValue(value: any): void {
    this.control.setValue(`${value}`)
  }

  registerOnChange(fn: any): void {
    this.changeFunc = fn
  }

  registerOnTouched(fn: any): void {
    this.touchFunc = fn
  }

  setDisabledState(isDisabled: boolean): void {

  }

  onKeydownInput(e: any): void {
    if (
      e.code === 'ArrowLeft'
      || e.code === 'ArrowRight'
      // || e.code === 'ShiftLeft'
      // || e.code === 'ShiftRight'
      // || e.code === 'ControlLeft'
      // || e.code === 'ControlRight'
    ) return

    let shieldedPostfix = ''
    for(let i = 0; i < this.postfix.length; i++) {
      shieldedPostfix += `\\${this.postfix[i]}`
    }

    let regExpPostfix = new RegExp(`${shieldedPostfix}`, 'g')

    e.target.value = e.target.value.replace(regExpPostfix, '').replace(/ /g, '').replace(/\,/g, '.')


    // this.value = e.target.value+e.data

    // console.log(this.value)

    // let value = e.target.value
    // setTimeout(() => {
    // }, 0)

    // this.updateValue(e.target.value)

    // e.preventDefault()
  }

  // onInputInput(e: any): void {

  // }

  //     answerBeforeDot = currBeforeDot.slice(-3)+' '+answerBeforeDot
  //     currBeforeDot = currBeforeDot.slice(0, -3)
  //   answerBeforeDot = answerBeforeDot.trim()
  //   console.log(answerBeforeDot)
  //   for (let i = 0; currBeforeDot.length > 0; i++) {
  //   if (!parseFloat(answerBeforeDot)) return
  //   let afterDot = str.split('.')[1]
  //   let answerBeforeDot = ''
  //   let beforeDot = str.split('.')[0]
  //   let currBeforeDot = beforeDot
  //   let num = parseFloat(value)
  //   let str = num.toString()
  //   this.changeFunc(value)
  //   this.value = `${answerBeforeDot} ${this.postfix}`
  //   value = value.split(' ')[0]
  //   } 
  // updateValue(value: string): void {
  // }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.subs.push(
      this.control.valueChanges.subscribe((value: string) => {

        let num = parseFloat(value)
        let str = num.toString()

        let ans = num.toLocaleString()

        let isDot = /\./g.test(value)

        let beforeDot = str.split('.')[0]
        let afterDot = str.split('.')[1]

        let currBeforeDot = beforeDot
        let answerBeforeDot = ''
        for (let i = 0; currBeforeDot.length > 0; i++) {
          answerBeforeDot = currBeforeDot.slice(-3)+' '+answerBeforeDot
          currBeforeDot = currBeforeDot.slice(0, -3)
        } 

        answerBeforeDot = answerBeforeDot.trim()

        let answerAfterDot = ''
        if (afterDot) {
          let currAfterDot = afterDot
          answerAfterDot = ''
          for (let i = 0; currAfterDot.length > 0; i++) {
            answerAfterDot = currAfterDot.slice(-3)+' '+answerAfterDot
            currAfterDot = currAfterDot.slice(0, -3)
          } 

          answerAfterDot = answerAfterDot.trim()
        }

        if (!parseFloat(answerBeforeDot)) {
          answerBeforeDot = '0'
        }

        if (!parseFloat(answerAfterDot)) {
          answerAfterDot = ''
        } else {
          answerAfterDot = answerAfterDot
        }

        let result = `${answerBeforeDot.trim()}${isDot ? ' . ' : ''}${answerAfterDot} ${this.postfix}`

        this.control.setValue(
          result,
          { emitEvent: false }
        )

        this.changeFunc(parseFloat(result.replace(/ /g, '').replace(/\,/g, '.')))
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

import { Component, OnInit, Input, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'app-desktop-radio',
  templateUrl: './desktop-radio.component.html',
  styleUrls: ['./desktop-radio.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DesktopRadioComponent),
    multi: true
  }]
})
export class DesktopRadioComponent implements OnInit, ControlValueAccessor {

  @Input() options: Array<{ title: string; value: string }> = []

  value: string = ''

  changeFunc!: Function
  touchFunc!: Function

  constructor() { }

  setOptions(value: any): void {
    this.changeFunc(value)
    this.value = value
  }

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.changeFunc = fn
  }

  registerOnTouched(fn: any): void {
    this.touchFunc = fn
  }

  setDisabledState(isDisabled: boolean): void {

  }

  ngOnInit(): void {
  }

}

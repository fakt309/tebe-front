import { Component, OnInit, Input, ElementRef, HostListener, forwardRef } from '@angular/core'
import { NumberService } from '../services/number.service'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'app-desktop-slide-money',
  templateUrl: './desktop-slide-money.component.html',
  styleUrls: ['./desktop-slide-money.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DesktopSlideMoneyComponent),
    multi: true
  }]
})
export class DesktopSlideMoneyComponent implements OnInit, ControlValueAccessor {

  @Input() options: Array<number> = [0, 1000]
  @Input() sign: string = '$'

  position: number = 0

  textCursor: string = ''

  cursor: any = {
    active: false
  }

  changeFunc!: Function
  touchFunc!: Function

  constructor(
    private host: ElementRef,
    public numberService: NumberService
  ) { }

  writeValue(index: number): void {
    this.position = index
  }

  registerOnChange(fn: any): void {
    this.changeFunc = fn
  }

  registerOnTouched(fn: any): void {
    this.touchFunc = fn
  }

  setDisabledState(isDisabled: boolean): void {

  }

  onMouseDownCursor(e: any): void {
    this.cursor.active = true
  }

  @HostListener('window:mousemove', ['$event']) onMouseMove(e: any): void {
    if (!this.cursor.active) return

    let [x, y] = [e.clientX, e.clientY]

    const rect = this.host.nativeElement.getBoundingClientRect()

    let index = Math.floor((x-rect.x)/(rect.width/(this.options.length-1)))

    if (index > this.options.length-2) index = this.options.length-2
    if (index < 0) index = 0

    this.setPostions(index)
  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(e: any): void {
    this.cursor.active = false
  }

  setPostions(index: number): void {
    const rect = this.host.nativeElement.getBoundingClientRect()
    this.position = (rect.width/(this.options.length-1))*index+(rect.width/(this.options.length-1))/2

    this.textCursor = `${this.numberService.easyAppearence(this.options[index])} ${this.sign} < ... < ${this.numberService.easyAppearence(this.options[index+1])} ${this.sign}`

    if (index === 0 && this.options[index] === this.options[index+1] && this.options[index] === 0) {
      this.textCursor = `${this.numberService.easyAppearence(this.options[index])} ${this.sign}`
    }

    if (index === this.options.length-2 && this.options[index] === this.options[index+1] && this.options[index] > 0) {
      this.textCursor = `${this.numberService.easyAppearence(this.options[index])} ${this.sign} < ...`
    }

    this.changeFunc(index)
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.setPostions(0)
    }, 0)
    
  }

}

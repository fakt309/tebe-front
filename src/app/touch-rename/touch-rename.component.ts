import { Component, OnInit, Input, ElementRef, SimpleChanges, HostBinding, EventEmitter, Output } from '@angular/core'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-rename',
  templateUrl: './touch-rename.component.html',
  styleUrls: ['./touch-rename.component.scss']
})
export class TouchRenameComponent implements OnInit {

  @Input() show: boolean = false
  @Input() value: string = ''
  @Input() min: number = 3
  @Input() max: number = 100
  @Input() enterable: boolean = false
  @Input() title: string = ''
  @Input() onlyNumbers: boolean = false
  @Input() useAnimate: boolean = true

  @Output() save: EventEmitter<string> = new EventEmitter()
  @Output() close: EventEmitter<string> = new EventEmitter()
  @Output() onInput: EventEmitter<string> = new EventEmitter()

  @HostBinding('style.display') display: string = 'none'
  @HostBinding('style.transform') transform: string = 'translateX(100%)'

  private timeout = setTimeout(() => {}, 0)

  // @HostListener('keydown', ['$event'])
  // onkeydown(e: any): void {
  //   this.trytosave()
  // }

  constructor(
    private host: ElementRef,
    private asyncservice: AsyncService,
    public locationService: LocationService
  ) { }

  refresh(e: any): void {
    let textarea = this.host.nativeElement.querySelector(".value")
    let save = false
    if (this.enterable && /\#/g.test(textarea.value)) save = true
    if (!this.enterable && e.inputType === 'insertLineBreak') save = true
    textarea.value = textarea.value.replace(/\#/g, "")
    if (this.onlyNumbers) textarea.value = textarea.value.replace(/[^0-9\.]/g, "")
    if (!this.enterable) textarea.value = textarea.value.replace(/[\n]+/g, "")
    this.value = textarea.value
    this.setsize()
    if (save) this.trytosave()
    this.onInput.emit(this.value)
  }

  setsize(): void {
    let minHeight = 58
    let textarea = this.host.nativeElement.querySelector(".value")
    textarea.style.height = '58px'
    let h = textarea.scrollHeight
    let limit = 50
    if (this.title !== '') limit = 100
    if (h >= window.innerHeight-limit) {
      h = window.innerHeight-limit
      textarea.style.height = `calc(100% - ${limit}px)`
    } else if (h < minHeight) {
      textarea.style.height = minHeight+'px'
    } else {
      textarea.style.height = h+'px'
    }

  }

  async doshow(): Promise<void> {
    if (this.useAnimate) {
      this.display = 'flex'
      await this.asyncservice.delay(10)
      this.setsize()
      this.host.nativeElement.querySelector(".value").focus()
      await this.asyncservice.delay(10)
      this.transform = 'translateX(0%)'
      await this.asyncservice.delay(300)
      return new Promise(res => res())
    } else {
      this.display = 'flex'
      this.setsize()
      this.host.nativeElement.querySelector(".value").focus()
      this.transform = 'translateX(0%)'
      return new Promise(res => res())
    }
  }

  async dohide(): Promise<void> {
    if (this.useAnimate) {
      this.host.nativeElement.querySelector(".value").blur()
      this.transform = 'translateX(100%)'
      await this.asyncservice.delay(300)
      this.display = 'none'
      this.close.emit()
      return new Promise(res => res())
    } else {
      this.host.nativeElement.querySelector(".value").blur()
      this.transform = 'translateX(100%)'
      this.display = 'none'
      this.close.emit()
      return new Promise(res => res())
    }
  }

  trytosave(): void {
    if (this.show === true) {
      if (this.value.length < this.min || this.value.length > this.max) {
        this.host.nativeElement.querySelector('.maxlength').style.animationName = 'shake'
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.host.nativeElement.querySelector('.maxlength').style.animationName = 'none'
        }, 200)
      } else {
        this.save.emit(this.value)
        this.dohide()
      }
    }
  }

  ngOnInit(): void {
    this.host.nativeElement.querySelector(".value").addEventListener('blur', (e: any) => {
      if (this.show) {
        this.host.nativeElement.querySelector(".value").focus()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      this.value = changes['value'].currentValue.toString()
      this.host.nativeElement.querySelector(".value").value = this.value
      this.setsize()
    }

    if (changes['show'] && changes['show'].previousValue !== changes['show'].currentValue) {
      if (changes['show'].currentValue) {
        this.doshow()
      } else {
        this.dohide()
      }
    }
  }

}

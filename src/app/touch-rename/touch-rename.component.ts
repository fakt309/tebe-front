import { Component, OnInit, Input, ElementRef, SimpleChanges, HostBinding, EventEmitter, Output } from '@angular/core'
import { AsyncService } from '../async.service'
import { LocationService } from '../services/location.service'
import { BackendService } from '../services/backend.service'

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
  @Input() prefix: string = ''
  @Input() lengthWithPrefix: boolean = true
  // @Input() customModify: ((t: string) => string) | null = null
  @Input() fontSizePrecentage: number = 300
  @Input() rule: ((t: string) => Promise<string | true>) | null = null

  @Output() save: EventEmitter<string> = new EventEmitter()
  @Output() close: EventEmitter<string> = new EventEmitter()
  @Output() onInput: EventEmitter<string> = new EventEmitter()

  @HostBinding('style.display') display: string = 'none'
  @HostBinding('style.transform') transform: string = 'translateX(100%)'

  isCorrectRule: true | string = true
  timeoutRefreshRule = setTimeout(() => {}, 0)

  private timeout = setTimeout(() => {}, 0)

  // @HostListener('keydown', ['$event'])
  // onkeydown(e: any): void {
  //   this.trytosave()
  // }

  constructor(
    private host: ElementRef,
    private asyncservice: AsyncService,
    public locationService: LocationService,
    public backendService: BackendService
  ) { }

  onTouchEnd(e: any): void {

    setTimeout(() => {
      if (e.target.selectionStart < this.prefix.length) {
        e.target.selectionStart = this.prefix.length
      }
    }, 100)
    
  }

  refresh(e: any): void {
    let textarea = this.host.nativeElement.querySelector(".value")
    let save = false

    if (this.prefix !== '') {
      // console.log(e.inputType)
      // console.log(this.prefix.length, e.target.selectionStart)
      // console.log(textarea.value)
      let v = textarea.value.replace(new RegExp(`^(${this.prefix}|${this.prefix.slice(0, -1)})`, 'g'), '')
      v = `${this.prefix}${v}`
      textarea.value = v
    }
    // if (this.customModify !== null) {
    //   textarea.value = this.customModify(textarea.value)
    // }

    if (this.enterable && /\#/g.test(textarea.value)) save = true
    if (!this.enterable && e.inputType === 'insertLineBreak') save = true
    textarea.value = textarea.value.replace(/\#/g, '')
    if (this.onlyNumbers) textarea.value = textarea.value.replace(/[^0-9\.]/g, '')
    if (!this.enterable) textarea.value = textarea.value.replace(/[\n]+/g, '')
    this.value = textarea.value
    this.setsize()
    if (save) {
      this.trytosave().then(() => {
        this.onInput.emit(this.value)
      })
    } else {
      clearTimeout(this.timeoutRefreshRule)
      this.timeoutRefreshRule = setTimeout(() => {
        this.refreshRule()
      }, 300)
    }
    
    setTimeout(() => {
      if (e.target.selectionStart < this.prefix.length) e.target.selectionStart = this.prefix.length
    }, 50)
  }

  async refreshRule(): Promise<void> {
    if (!this.rule) {
      this.isCorrectRule = true
      return new Promise(res => res())
    }
    this.isCorrectRule = await this.rule(this.value.replace(this.prefix, ''))
    return new Promise(res => res())
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

  isLengthCorrect(): boolean {
    let length = this.value.length

    if (!this.lengthWithPrefix) length -= this.prefix.length

    if (length < this.min || length > this.max) {
      return false
    }
    return true
  }

  // async isCorrectRule(): Promise<true | string> {
  //   if (!this.rule) return true
  //   return (await this.rule(this.value.replace(this.prefix, '')))
  // }

  async trytosave(): Promise<void> {
    let length = this.value.length

    await this.refreshRule()

    if (this.lengthWithPrefix) length -= this.prefix.length

    if (this.show === true) {
      if (!this.isLengthCorrect() || this.isCorrectRule !== true) {
        this.host.nativeElement.querySelector('.maxlength').style.animationName = 'shake'
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.host.nativeElement.querySelector('.maxlength').style.animationName = 'none'
        }, 200)
      } else {
        this.save.emit(this.value.replace(this.prefix, ''))
        this.dohide()
      }
    }

    return new Promise(res => res())
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

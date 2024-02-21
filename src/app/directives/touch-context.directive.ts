import { Directive, HostListener, Input, ElementRef, Output, EventEmitter } from '@angular/core'
import { AsyncService } from '../async.service'

@Directive({
  selector: '[appTouchContext]'
})
export class TouchContextDirective {

  @Input('contextDisable') disable: boolean = false
  @Input('contextOptions') options: Array<any> = []

  @Output() contextClose: EventEmitter<string | null> = new EventEmitter<string | null>()
  @Output() contextOpen: EventEmitter<void> = new EventEmitter<void>()

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService
  ) { }

  private elementWrap: any = null
  private elementContent: any = null

  msToOpen: number = 200

  touch: any = {
    down: false,
    wasMove: false,
    timeout: setTimeout(() => {}, 0),
    coord: { x: 0, y: 0 }
  }

  settings: any = {
    width: 200,
    height: 252-15
  }

  @HostListener('touchstart', ['$event']) onTouchstart(e: any): void {
    this.touchStart(e)
  }

  @HostListener('touchmove', ['$event']) onTouchmove(e: any): void {
    this.touchMove(e)
  }

  @HostListener('touchend', ['$event']) onTouchend(e: any): void {
    this.touchEnd(e)
  }

  @HostListener('touchcancel', ['$event']) onTouchcancel(e: any): void {
    this.touchEnd(e)
  }

  touchStart(e: any): void {
    if (!this.disable) e.preventDefault()
    this.touch.down = true

    let [x, y] = [e.touches[0].clientX, e.touches[0].clientY]

    this.touch.coord.x = x
    this.touch.coord.y = y

    this.touch.timeout = setTimeout(() => {
      if (!this.disable) this.showContext()
    }, this.msToOpen)
  }

  touchMove(e: any): void {
    if (!this.touch.down) return

    this.touch.wasMove = true
    clearTimeout(this.touch.timeout)
  }

  touchEnd(e: any): void {
    this.touch.down = false
    this.touch.wasMove = false
    clearTimeout(this.touch.timeout)
  }

  async showContext(): Promise<void> {

    this.contextOpen.emit()

    const host = this.host.nativeElement
    const hostRect = host.getBoundingClientRect()

    const wrap = document.createElement('div')
    wrap.style.position = `absolute`
    wrap.style.width = `${hostRect.width}px`
    wrap.style.height = `${hostRect.height}px`
    wrap.style.left = `${hostRect.x}px`
    wrap.style.top = `${hostRect.y}px`
    wrap.style.backgroundColor = `#ffffff11`;
    (wrap as any).style.backdropFilter = `blur(10px)`
    wrap.style.zIndex = `100`
    wrap.style.opacity = `0`
    wrap.style.transition = `all ease 0.2s`

    wrap.onclick = () => {
      this.contextClose.emit('')
      this.hideContext()
    }

    let posContext = { x: this.touch.coord.x-this.settings.width/2, y: this.touch.coord.y-this.settings.height/2 }
    if (posContext.x < 0) posContext.x = 0
    if (posContext.x+this.settings.width > window.innerWidth) posContext.x = window.innerWidth-this.settings.width
    if (posContext.y < 0) posContext.y = 0
    if (posContext.y+this.settings.height > window.innerHeight) posContext.y = window.innerHeight-this.settings.height

    const content = document.createElement('div')
    content.setAttribute('class', 'no-scroll')
    content.style.position = `absolute`
    content.style.display = `flex`
    content.style.flexDirection = `column`
    content.style.alignItems = `stretch`
    content.style.justifyContent = `flex-start`
    content.style.overflowY = `auto`
    content.style.width = `${this.settings.width}px`
    content.style.maxHeight = `${this.settings.height}px`
    content.style.left = `${posContext.x}px`
    content.style.top = `${posContext.y}px`
    content.style.backgroundColor = `#ffffff`
    content.style.borderRadius = `10px`
    content.style.boxShadow = `0px 0px 5px #00000099`
    content.style.zIndex = `101`
    content.style.opacity = `0`
    content.style.transform = `scale(0.01)`
    content.style.transition = `all ease 0.2s`

    this.options.forEach((option: any) => {
      const opt = document.createElement('div')

      if (option.hr) {
        opt.style.margin = `10px`
        opt.style.color = `#333333`
        opt.style.fontSize = `14px`
        opt.style.height = '1px'
        opt.style.flexShrink = '0'
        opt.style.backgroundColor = '#00000033'
        content.append(opt)
      } else {
        let icon = document.createElement('div')
        let text = document.createElement('div')

        opt.style.display = `flex`
        opt.style.flexDirection = `row`
        opt.style.alignItems = `center`
        opt.style.justifyContent = `flex-start`
        opt.style.padding = `20px`
        opt.style.color = `#333333`
        opt.style.fontSize = `14px`
        icon.style.width = `20px`
        icon.style.height = `20px`
        icon.style.marginRight = `10px`
        icon.style.backgroundImage = `url(${option.icon})`
        icon.style.backgroundPosition = `center`
        icon.style.backgroundSize = `contain`
        icon.style.backgroundRepeat = `no-repeat`
        text.innerHTML = option.title

        opt.append(icon)
        opt.append(text)
        content.append(opt)

        opt.onclick = () => {
          let op = option
          this.contextClose.emit(op.value)
          this.hideContext()
        }
      }
      
    })

    this.elementWrap = wrap
    this.elementContent = content
    document.body.append(wrap)
    document.body.append(content)

    await this.asyncService.delay(10)

    content.style.transform = `scale(1)`
    content.style.opacity = `1`
    wrap.style.opacity = `1`
  }

  async hideContext(): Promise<void> {

    this.elementWrap.style.opacity = '0'
    this.elementContent.style.opacity = '0'
    this.elementContent.style.scale = '0.01'

    await this.asyncService.delay(200)

    this.elementWrap.remove()
    this.elementContent.remove()

  }


}

import { Component, OnInit, OnChanges, Input, SimpleChanges, ElementRef, HostBinding, AfterViewInit, ViewChild, Output, EventEmitter, HostListener } from '@angular/core'
import { AsyncService } from '../async.service'
import { trigger, state, transition, style, animate } from '@angular/animations'
import { FormControl } from '@angular/forms'
import { ReadFileService } from '../services/read-file.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-desktop-edit-gift',
  templateUrl: './desktop-edit-gift.component.html',
  styleUrls: ['./desktop-edit-gift.component.scss'],
  animations: [
    trigger('verticalShow', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ transform: 'translateY(-100%)' }))
      ])
    ]),
    trigger('popup', [
      state('open', style({
        display: 'flex',
        transform: 'translateX(70px) translateY(-60px)',
        opacity: '1'
      })),
      state('close', style({
        transform: 'translateX(70px) translateY(-80px)',
        opacity: '0',
        display: 'none'
      })),
      transition('open <=> close', animate('0.2s ease'))
    ])
  ]
})
export class DesktopEditGiftComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('mockButtons', { read: ElementRef }) mockButtonsRef!: ElementRef

  @HostBinding('class.animate') animate: boolean = false

  @Input() gift: any = null
  @Input() initialRect: any = null

  @Output() close: EventEmitter<void> = new EventEmitter<void>()

  editingTitle: boolean = false

  insideWrapDOM: any = {
    maxWidth: '800px'
  }
  mockButtonsDOM: any = {
    display: 'flex',
    opacity: '0',
    maxWidth: '400px'
  }
  viewDOM: any = {
    width: '200px',
    height: '200px'
  }
  giftDOM: any = {
    size: 190
  }
  closeDOM: any = {
    opacity: '0',
    transform: 'translateY(-50px)'
  }
  contentAdditionDOM: any = {
    opacity: '0',
    maxHeight: '0px'
  }
  editIconTitleDOM: any = {
    opacity: '0'
  }

  imageUpload: any = {
    visible: false,
    type: 'none',
    img: '',
    cancelImg: '',
    ratio: 16/9,
    mode: 'usual',
    sublimesave: false,
    showList: false
  }

  webcamVideo: any = {
    visible: false,
    recording: false,
    screen: 'recording',
    showConfirm: 'close',
    sublimeUninit: false
  }

  takePicture: any = {
    visible: false,
    preview: false,
    sublimeTakePicture: false,
    sublimeSave: false,
    sublimeCancel: false
  }

  signGreetingcard: any = {
    visible: false,
    tool: 'pen',
    color: '#ffffff'
  }

  signPhoto: any = {
    visible: false,
    tool: 'pen',
    color: '#000000'
  }

  rotateGift: any = {
    angle: 0,
    pause: false,
    interval: setInterval(() => {}, 9999),
    animate: false,
    startMouse: 0,
    startRotate: 0
  }

  showTextGreetingcard: boolean = false

  textError: string = '';
  timeoutError = setTimeout(() => {}, 0);

  showTextCodeGame: boolean = false
  openGame: boolean = false

  showListPlatformsGame: boolean = false

  audioSpeaker: any = {
    visible: false,
    sublimestop: false
  }

  showSideListTableCase: boolean = false

  @ViewChild('confirmWebcamVideo') confirmWebcamVideoRef!: ElementRef

  constructor(
    private asyncService: AsyncService,
    private host: ElementRef,
    private readfileservice: ReadFileService,
    public locationService: LocationService
  ) { }

  startRotate(): void {
    let speed = 1
    clearInterval(this.rotateGift.interval)
    this.rotateGift.interval = setInterval(() => {
      if (!this.rotateGift.pause) {
        this.rotateGift.angle += speed
        if (this.rotateGift.angle > 360) this.rotateGift.angle -= 360
        if (this.rotateGift.angle < 0) this.rotateGift.angle += 360
      }
    }, 10)
  }

  @HostListener('window:click', ['$event']) onMouseClick(e: any) {
    if (this.webcamVideo.showConfirm === 'open' && !this.confirmWebcamVideoRef.nativeElement.contains(e.target)) {
      this.webcamVideo.showConfirm = 'close'
    }
  }

  async stopRotate(): Promise<void> {
    this.rotateGift.animate = true
    await this.asyncService.delay(10)
    clearInterval(this.rotateGift.interval)
    if (this.rotateGift.angle < 180) {
      this.rotateGift.angle = 0
    } else {
      this.rotateGift.angle = 360
    }
    await this.asyncService.delay(200)
    this.rotateGift.animate = false
    return new Promise(res => res())
  }

  mousedownIcon(e: any): void {
    this.rotateGift.pause = true
    this.rotateGift.startMouse = e.clientX
    this.rotateGift.startRotate = this.rotateGift.angle
    document.body.style.userSelect = 'none'
  }

  @HostListener('window:mousemove', ['$event']) onMouseMove(e: any): void {
    if (!this.rotateGift.pause) return
    if (this.gift.type === 'game' && this.openGame) return
    this.rotateGift.angle = this.rotateGift.startRotate+(e.clientX-this.rotateGift.startMouse)
    if (this.rotateGift.angle > 360) this.rotateGift.angle -= 360
    if (this.rotateGift.angle < 0) this.rotateGift.angle += 360
  }

  @HostListener('window:mouseup', ['$event']) onMouseUp(): void {
    if (this.rotateGift.pause) clearInterval(this.rotateGift.interval)
    this.rotateGift.pause = false
    this.rotateGift.startMouse = 0
    this.rotateGift.startRotate = 0
    document.body.style.userSelect = 'auto'
  }

  @HostListener('window:mouseleave', ['$event']) onMouseLeave(): void {
    this.rotateGift.pause = false
    this.rotateGift.startMouse = 0
    this.rotateGift.startRotate = 0
    document.body.style.userSelect = 'auto'
  }

  async show(): Promise<void> {
    const el: HTMLElement = this.host.nativeElement

    el.style.left = (this.initialRect.x+10)+'px'
    el.style.top = this.initialRect.y+'px'
    el.style.width = this.initialRect.width+'px'
    el.style.height = this.initialRect.height+'px'
    el.style.borderRadius = '20px'
    this.mockButtonsDOM.display = 'flex'
    this.mockButtonsDOM.opacity = '1'
    this.mockButtonsDOM.maxWidth = '400px'
    this.viewDOM.width = '200px'
    this.viewDOM.height = '200px'
    this.giftDOM.size = 190
    this.closeDOM.opacity = '0'
    this.closeDOM.transform = 'translateY(-50px)'
    this.contentAdditionDOM.opacity = '0'
    this.contentAdditionDOM.maxHeight = '0px'
    this.insideWrapDOM.maxWidth = '800px'

    await this.asyncService.delay(10)

    this.animate = true

    await this.asyncService.delay(10)

    el.style.left = '0px'
    el.style.top = '0px'
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.borderRadius = '0px'
    this.mockButtonsDOM.opacity = '0'
    this.mockButtonsDOM.maxWidth = '0px'
    this.closeDOM.opacity = '1'
    this.closeDOM.transform = 'translateY(0px)'
    this.viewDOM.width = '500px'
    this.viewDOM.height = '500px'
    this.contentAdditionDOM.maxHeight = '4000px'
    this.contentAdditionDOM.opacity = '1'
    this.insideWrapDOM.maxWidth = '1000px'

    await this.asyncService.delay(300)

    this.giftDOM.size = 390
    this.editIconTitleDOM.opacity = '1'

    await this.asyncService.delay(300)

    this.mockButtonsDOM.display = 'none'

    await this.asyncService.delay(100)

    this.animate = false

    this.startRotate()

    return new Promise(res => res())
  }

  async hide(): Promise<void> {
    if (this.audioSpeaker.visible) this.audioSpeaker.sublimestop = !this.audioSpeaker.sublimestop

    const el: HTMLElement = this.host.nativeElement

    await this.stopRotate()

    el.style.left = '0px'
    el.style.top = '0px'
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.borderRadius = '0px'
    this.mockButtonsDOM.opacity = '0'
    this.mockButtonsDOM.maxWidth = '0px'
    this.closeDOM.opacity = '1'
    this.closeDOM.transform = 'translateY(0px)'
    this.viewDOM.width = '500px'
    this.viewDOM.height = '500px'
    this.contentAdditionDOM.maxHeight = '4000px'
    this.contentAdditionDOM.opacity = '1'
    this.giftDOM.size = 390
    this.insideWrapDOM.maxWidth = '1000px'
    this.mockButtonsDOM.display = 'flex'
    this.editIconTitleDOM.opacity = '0'

    await this.asyncService.delay(10)

    this.animate = true

    await this.asyncService.delay(10)

    this.giftDOM.size = 190
    this.closeDOM.opacity = '0'
    this.closeDOM.transform = 'translateY(-50px)'
    this.contentAdditionDOM.opacity = '0'
    this.contentAdditionDOM.maxHeight = '0px'

    await this.asyncService.delay(300)

    el.style.left = (this.initialRect.x+10)+'px'
    el.style.top = this.initialRect.y+'px'
    el.style.width = this.initialRect.width+'px'
    el.style.height = this.initialRect.height+'px'
    el.style.borderRadius = '20px'
    this.mockButtonsDOM.display = 'flex'
    this.mockButtonsDOM.opacity = '1'
    this.mockButtonsDOM.maxWidth = '400px'
    this.viewDOM.width = '200px'
    this.viewDOM.height = '200px'
    this.insideWrapDOM.maxWidth = '800px'

    await this.asyncService.delay(300)

    this.animate = false

    this.close.emit()

    return new Promise(res => res())
  }

  onChoosePlatformGame(platform: string): void {
    this.showListPlatformsGame = false

    if (platform === '') return

    this.gift.platform = platform
    if (platform === 'pc') {
      this.gift.color = "#000000"
      this.gift.inside = "../../assets/game/game.png"
      this.gift.side = "../../assets/game/gameleft.png"
    } else if (platform === 'ps') {
      this.gift.color = "#003791"
      this.gift.inside = "../../assets/game/ps.png"
      this.gift.side = "../../assets/game/psleft.png"
    } else if (platform === 'xbox') {
      this.gift.color = "#107C10"
      this.gift.inside = "../../assets/game/xbox.png"
      this.gift.side = "../../assets/game/xboxleft.png"
    } else if (platform === 'switch') {
      this.gift.color = "#e60012"
      this.gift.inside = "../../assets/game/switch.png"
      this.gift.side = "../../assets/game/switchleft.png"
    } if (platform === 'custom') {
      this.gift.color = "#000000"
      this.gift.inside = "../../assets/game/game.png"
      this.gift.side = "../../assets/game/gameleft.png"
    }

  }

  saveSignGreetingcard(points: Array<any>) {
    this.gift.sign = [...points]
  }

  inputTitle(e: any): void {
    this.gift.title = e.target.value
  }

  inputTextGreetingcard(e: any) {
    this.gift.text = e.target.value;
  }

  setColorTextGreetingCard(e: any) {
    this.gift.color = e.target.value
  }

  setColorSignGreetingcard(e: any) {
    this.signGreetingcard.color = e.target.value
  }

  setColorSignPhoto(e: any) {
    this.signPhoto.color = e.target.value
  }

  setCodeGame(e: any) {
    this.gift.code = e.target.value
  }

  async switchTextCodeGame(): Promise<void> {
    if (!this.showTextCodeGame) {
      this.stopRotate()
      this.openGame = true
    } else {
      this.animate = true
      await this.asyncService.delay(100)
      this.openGame = false
      await this.asyncService.delay(300)
      this.animate = false
    }
    this.showTextCodeGame = !this.showTextCodeGame
    return new Promise(res => res())
  }

  inputUploadImage(e: any): void {
    this.saveUploadImage(e.target.files[0])
  }

  async tryuploadimage(e: any): Promise<any> {
    const file = e.target.files[0]
    let error = []
    let img: any = {}
    if (file.size/(1024**2) > 3) {
      error.push('should be less than 3 MB')
    }
    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/webp' && file.type !== 'image/x-icon' && file.type !== 'image/gif') {
      error.push('should be type of png, jpeg, webp, gif, icon')
    }

    if (!error[0]) {
      img = await this.readfileservice.getImageFromFile(file)
      if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
        error.push('should be less than 1920x1080')
      }
    }

    if (!error[0]) {
      this.imageUpload.mode = 'trim'
      this.imageUpload.cancelImg = this.imageUpload.img
      this.imageUpload.img = img.src
    } else {
      this.showError(error.join('; '))
      e.target.value = null
    }

    return new Promise(res => res(true))
  }

  async showError(text: string): Promise<void> {
    clearTimeout(this.timeoutError)
    this.textError = ''
    await this.asyncService.delay(100)
    this.textError = text
    this.timeoutError = setTimeout(() => {
      this.textError = ''
    }, 5000)
    return new Promise(res => res())
  }

  saveUploadImage(image: string): void {
    this.imageUpload.mode = 'usual'

    if (this.gift.type === 'greetingcard' && this.imageUpload.type === 'front') {
      this.gift.front = image
    } else if (this.gift.type === 'greetingcard' && this.imageUpload.type === 'back') {
      this.gift.back = image
    } else if (this.gift.type === 'game' && this.imageUpload.type === 'front') {
      this.gift.front = image
    } else if (this.gift.type === 'game' && this.imageUpload.type === 'inside') {
      this.gift.inside = image
    } else if (this.gift.type === 'game' && this.imageUpload.type === 'left-side') {
      this.gift.side = image
    } else if (this.gift.type === 'speaker' && this.imageUpload.type === 'grill') {
      this.gift.grill = image
    }

    this.imageUpload.cancelImg = ''
    // this.imageUpload.type = 'none'
  }

  showUploadImageFrontGreetingCard(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.gift.front
    this.imageUpload.type = 'front'
    this.imageUpload.ratio = 297/420
    this.imageUpload.mode = 'usual'
  }

  showUploadImageFrontGame(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.gift.front
    this.imageUpload.type = 'front'
    this.imageUpload.ratio = 828/1000
    this.imageUpload.mode = 'usual'
  }

  showUploadImageBack(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.gift.back
    this.imageUpload.type = 'back'
    this.imageUpload.ratio = 100/100
    this.imageUpload.mode = 'usual'
  }

  showUploadImageInside(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.gift.inside
    this.imageUpload.type = 'inside'
    this.imageUpload.ratio = 100/100
    this.imageUpload.mode = 'usual'
  }

  showUploadImageLeftSide(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.gift.side
    this.imageUpload.type = 'left-side'
    this.imageUpload.ratio = 15/190
    this.imageUpload.mode = 'usual'
  }

  showUploadImageGrill(): void {
    this.imageUpload.visible = true
    this.imageUpload.img = this.gift.grill
    this.imageUpload.type = 'grill'
    this.imageUpload.ratio = 100/100
    this.imageUpload.mode = 'usual'
  }

  noListUploadImage(): boolean {
    if (this.gift.type === 'greetingcard') {
      if (this.imageUpload.type === 'front' || this.imageUpload.type === 'back') return false
    } else if (this.gift.type === 'game') {
      if (this.imageUpload.type === 'front' || this.imageUpload.type === 'left-side' || this.imageUpload.type === 'inside') return true
    }
    return false
  }

  getListUploadImages(): Array<string> {

    if (this.gift.type === 'greetingcard' && this.imageUpload.type === 'front') {
      return ['../../assets/greetingcard/front/1.png', '../../assets/greetingcard/front/2.png', '../../assets/greetingcard/front/3.png', '../../assets/greetingcard/front/4.png', '../../assets/greetingcard/front/5.png', '../../assets/greetingcard/front/6.png', '../../assets/greetingcard/front/7.png', '../../assets/greetingcard/front/8.png', '../../assets/greetingcard/front/9.png', '../../assets/greetingcard/front/10.png', '../../assets/greetingcard/front/11.png', '../../assets/greetingcard/front/12.png', '../../assets/greetingcard/front/13.png', '../../assets/greetingcard/front/14.png', '../../assets/greetingcard/front/15.png', '../../assets/greetingcard/front/16.png', '../../assets/greetingcard/front/17.png', '../../assets/greetingcard/front/18.png', '../../assets/greetingcard/front/19.png', '../../assets/greetingcard/front/20.png', '../../assets/greetingcard/front/21.png', '../../assets/greetingcard/front/22.png', '../../assets/greetingcard/front/23.png', '../../assets/greetingcard/front/24.png', '../../assets/greetingcard/front/25.png', '../../assets/greetingcard/front/26.png', '../../assets/greetingcard/front/27.png', '../../assets/greetingcard/front/28.png', '../../assets/greetingcard/front/29.png', '../../assets/greetingcard/front/30.png', '../../assets/greetingcard/front/31.png', '../../assets/greetingcard/front/32.png', '../../assets/greetingcard/front/33.png', '../../assets/greetingcard/front/34.png', '../../assets/greetingcard/front/35.png', '../../assets/greetingcard/front/36.png', '../../assets/greetingcard/front/37.png', '../../assets/greetingcard/front/38.png', '../../assets/greetingcard/front/39.png', '../../assets/greetingcard/front/40.png']
    } else if (this.gift.type === 'greetingcard' && this.imageUpload.type === 'back') {
      return ['../../assets/greetingcard/back/1.jpg', '../../assets/greetingcard/back/2.jpg', '../../assets/greetingcard/back/3.jpg', '../../assets/greetingcard/back/4.jpg', '../../assets/greetingcard/back/5.jpg', '../../assets/greetingcard/back/6.jpg', '../../assets/greetingcard/back/7.jpg', '../../assets/greetingcard/back/8.jpg', '../../assets/greetingcard/back/9.jpg', '../../assets/greetingcard/back/10.jpg', '../../assets/greetingcard/back/11.jpg', '../../assets/greetingcard/back/12.jpg', '../../assets/greetingcard/back/13.jpg', '../../assets/greetingcard/back/14.jpg', '../../assets/greetingcard/back/15.jpg', '../../assets/greetingcard/back/16.jpg', '../../assets/greetingcard/back/17.jpg', '../../assets/greetingcard/back/18.jpg', '../../assets/greetingcard/back/19.jpg', '../../assets/greetingcard/back/20.jpg']
    } else if (this.gift.type === 'speaker' && this.imageUpload.type === 'grill') {
      return ['../../assets/speaker/grill/0.png', '../../assets/speaker/grill/1.png', '../../assets/speaker/grill/2.png', '../../assets/speaker/grill/3.png', '../../assets/speaker/grill/4.png', '../../assets/speaker/grill/5.png', '../../assets/speaker/grill/6.png']
    }

    return []
  }

  saveSpeaker(val: any) {
    this.gift.value = val.chunks
    this.gift.sounds = val.sounds
    this.gift.duration = val.duration
  }

  selectUploadImage(image: string): void {
    this.imageUpload.showList = false

    if (image === '') return

    this.imageUpload.cancelImg = this.imageUpload.img
    this.imageUpload.img = image
    setTimeout(() => {
      this.imageUpload.mode = 'trim'
    }, 100)
  }

  cancelTrim(): void {
    this.imageUpload.mode = 'usual'

    if (this.imageUpload.cancelImg !== '') this.imageUpload.img = this.imageUpload.cancelImg

    this.imageUpload.cancelImg = ''
  }

  saveWebcamVideo(data: any): void {
    this.gift.value = data.value
    this.gift.duration = data.duration
    this.webcamVideo.screen = 'watching'
  }

  resultWebcamConfirm(res: string): void {
    if (res === 'agree') {
      this.gift.value = []
      this.gift.duration = 0
      this.webcamVideo.recording = true
    }
    this.webcamVideo.showConfirm = 'close'
  }

  switchWebcamRecord(): void {
    if (this.webcamVideo.showConfirm === 'open') return

    if (!this.webcamVideo.recording) {
      if (this.gift.value) {
        setTimeout(() => {
          this.webcamVideo.showConfirm = 'open'
        }, 100)
      } else {
        this.webcamVideo.recording = true
      }
    } else {
      this.webcamVideo.recording = false
    }
  }

  switchWebcamVideoMode(): void {
    if (!this.gift.value[0] || this.webcamVideo.showConfirm === 'open' || this.webcamVideo.recording) return

    if (this.webcamVideo.screen === 'recording') {
      this.webcamVideo.screen = 'watching'
    } else {
      this.webcamVideo.screen = 'recording'
    }
  }

  onChooseTabletCase(options: string): void {
    this.showSideListTableCase = false
    if (options === '') return

    let color = "#C0C0C0"

    if (options === "pure-silver") {
      color = "#C0C0C0"
    } else if (options === "sierra-blue") {
      color = "#69abce"
    } else if (options === "alpine-green") {
      color = "#005f56"
    } else if (options === "shining-gold") {
      color = "#FFDF4F"
    } else if (options === "dark-matter") {
      color = "#2b2031"
    }

    this.gift.color = color
  }

  saveTakePicture(img: string): void {
    this.takePicture.preview = false

    if (img === '') return

    this.gift.photo = img
  }

  switchShowRecordAudioSpeaker(): void {
    if (this.audioSpeaker.visible) this.audioSpeaker.sublimestop = !this.audioSpeaker.sublimestop
    this.audioSpeaker.visible = !this.audioSpeaker.visible
  }

  async closeWebcamVideo(): Promise<void> {
    // this.webcamVideo.sublimeUninit = !this.webcamVideo.sublimeUninit
    // await this.asyncService.delay(1000)
    this.webcamVideo.screen = 'recording'
    this.webcamVideo.visible = false
    return new Promise(res => res())
  }

  ngAfterViewInit(): void {
    this.show()
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['gift'] && (changes['gift'].previousValue === null || changes['gift'].previousValue === undefined) && changes['gift'].currentValue !== null) {
    //   // this.show()
    // }
  }

}

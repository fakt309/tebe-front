import { Component, OnInit, OnDestroy, ElementRef, HostBinding, HostListener, Output, EventEmitter, Input, SimpleChanges, ViewChild } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-desktop-webcam-video',
  templateUrl: './desktop-webcam-video.component.html',
  styleUrls: ['./desktop-webcam-video.component.scss'],
  animations: [
    trigger('verticalShow', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: '0' }),
        animate('200ms', style({ transform: 'translateY(0px)', opacity: '1' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ transform: 'translateY(0px)', opacity: '0' }))
      ])
    ])
  ]
})
export class DesktopWebcamVideoComponent implements OnInit, OnDestroy {

  @Input() recording: boolean = false
  @Input() screen: string = 'recording'
  @Input() duration: number = 0
  @Input() value: Array<any> = []
  @Input() sublimeuninit: boolean = false

  @ViewChild('progressRef') progressRef!: ElementRef

  public loading: boolean = true

  public error: string = ''

  public width: number = 0
  public height: number = 0

  public text: string = ''

  public status: string = 'none'

  public recorder!: MediaRecorder

  public confirm: string = ''

  public chunks: Array<any> = []

  public timer: number = 0
  public interval: any = setInterval(() => {}, 1000000)

  public playing: boolean = false

  stream!: MediaStream

  public progress: any = {
    active: false,
    playing: false,
    value: 0,
    interval: setInterval(() => {}, 1000000)
  }

  @Output() save: EventEmitter<{value: Array<any>; duration: number}> = new EventEmitter<{value: Array<any>; duration: number}>()

  @HostBinding('style.backgroundColor') backgroundColor: string = '#ffffff'

  constructor(
    private host: ElementRef,
    private asyncService: AsyncService
  ) { }

  // @HostListener('click') onClick(): void {
  //   if (this.confirm === '') {
  //     if (this.status === 'waiting') {
  //       this.startRecord()
  //     } else if (this.status === 'recording') {
  //       this.stopRecord()
  //     }
  //   }
  //
  // }

  onMouseDownProgress(e: any): void {
    this.progress.active = true
    this.progress.playing = this.playing
    this.stopPlaying()

    let vid = this.host.nativeElement.querySelector(".result")
    let rect = this.progressRef.nativeElement.getBoundingClientRect()

    this.progress.value = ((e.clientX-rect.x)/rect.width)
    if (this.progress.value > 1) this.progress.value = 1
    if (this.progress.value < 0) this.progress.value = 0

    vid.currentTime = this.progress.value*this.duration
  }

  @HostListener('window:mousemove', ['$event']) onMouseMoveProgress(e: any): void {
    if (!this.progress.active) return

    let vid = this.host.nativeElement.querySelector(".result")
    let rect = this.progressRef.nativeElement.getBoundingClientRect()

    this.progress.value = ((e.clientX-rect.x)/rect.width)
    if (this.progress.value > 1) this.progress.value = 1
    if (this.progress.value < 0) this.progress.value = 0

    vid.currentTime = this.progress.value*this.duration
  }

  @HostListener('window:mouseup', ['$event']) onMouseUpProgress(e: any): void {
    if (!this.progress.active) return
    this.progress.active = false
    if (this.progress.playing) this.startPlaying()
  }

  @HostListener('window:mouseleave', ['$event']) onMouseLeaveProgress(e: any): void {
    if (!this.progress.active) return
    this.progress.active = false
    this.stopPlaying()
  }

  async init(): Promise<MediaStream> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    } else {
      return new Promise((res:any, rej: any) => rej("Your browser does not support video recording"))
    }
  }

  setSize(): void {
    let preview = this.host.nativeElement.querySelector(".preview")
    let ratioVideo = preview.videoWidth/preview.videoHeight
    let ratioWindow = window.innerWidth/window.innerHeight
    if (ratioWindow > ratioVideo) {
      this.height = window.innerHeight
      this.width = window.innerHeight*ratioVideo
    } else if (ratioWindow <= ratioVideo) {
      this.width = window.innerWidth
      this.height = window.innerWidth/ratioVideo
    }
  }

  async startRecord(): Promise<void> {
    if (this.recorder) {
      await this.initRecord()
    }
    this.chunks = []
    this.timer = 30
    this.interval = setInterval(() => {
      this.timer--
      if (this.timer <= 0) this.stopRecord()
    }, 1000)
    this.status = 'recording'
    this.text = 'tap to stop record'
    // this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(1) > animate').beginElement()
    // this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(2) > animate').beginElement()
    setTimeout(() => {
      this.recorder.start()
    }, 100)
  }

  stopRecord(): void {
    this.duration = 30-this.timer
    clearInterval(this.interval)
    this.status = 'waiting'
    this.timer = 0
    this.text = 'tap to start record'
    // this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(1) > animate').endElement()
    // this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(2) > animate').endElement()
    this.recorder.stop()
  }

  resultconfirm(res: string) {
    if (res === 'agree') {
      this.chunks = []
      setTimeout(() => {
        this.confirm = ""
        this.startRecord()
      }, 100)
    } else if (res === 'reject') {
      this.confirm = ""
    }
  }

  async initRecord(): Promise<void> {
    if (this.stream) this.uninit()
    try {
      this.stream = await this.init()
      let preview = this.host.nativeElement.querySelector(".preview")
      preview.setAttribute("muted", "true")
      preview.srcObject = this.stream
      preview.captureStream = preview.captureStream || preview.mozCaptureStream
      preview.onplay = () => {
        this.text = 'tap to start record'
        this.backgroundColor = '#000000'
        this.setSize()
        this.status = 'waiting'
        this.loading = false
      }

      this.recorder = new MediaRecorder(this.stream)
      this.recorder.ondataavailable = (e: any) => {
        this.chunks.push(e.data)
        this.save.emit({value: this.chunks, duration: this.duration})
      }
    } catch (err) {
      if ((err as string).toString() === 'NotAllowedError: Permission denied' || (err as string).toString() === 'NotAllowedError: Permission dismissed') {
        this.error = "Webcam not allowed"
      } else {
        this.error = err as string
      }
    }
  }

  // async initPlaying(): Promise<void> {
  //   try {
  //     let stream = await this.init()
  //     let preview = this.host.nativeElement.querySelector(".preview")
  //     preview.setAttribute("muted", "false")
  //     preview.srcObject = this.chunks
  //     preview.captureStream = preview.captureStream || preview.mozCaptureStream
  //     preview.onplay = () => {
  //       this.text = 'tap to start record'
  //       this.backgroundColor = '#000000'
  //       this.setSize()
  //       this.status = 'waiting'
  //       this.loading = false
  //     }
  //
  //     this.recorder = new MediaRecorder(stream)
  //     this.recorder.ondataavailable = (e: any) => {
  //       this.chunks.push(e.data)
  //       this.save.emit({value: this.chunks, duration: this.duration})
  //       // this.createVideo()
  //     }
  //   } catch (err) {
  //     if ((err as string).toString() === 'NotAllowedError: Permission denied' || (err as string).toString() === 'NotAllowedError: Permission dismissed') {
  //       this.error = "Webcam not allowed"
  //     } else {
  //       this.error = err as string
  //     }
  //   }
  // }

  uninit(): void {
    let preview = this.host.nativeElement.querySelector(".preview")
    if (preview?.srcObject) preview.srcObject.getTracks().forEach((track: any) => track.stop())
    if (this.stream) this.stream.getTracks().forEach((track: any) => track.stop())
    if (this.recorder?.stream) this.recorder.stream.getTracks().forEach((track: any) => track.stop())
    // preview.srcObject = null
    // preview.captureStream = null
    // preview.remove()
    // this.stream.getTracks().forEach(track => track.stop())
    // this.recorder.stream.getTracks().forEach(track => track.stop())
  }

  createVideo(): void {
    this.uninit()
    let vid = this.host.nativeElement.querySelector(".result")
    vid.setAttribute('control', '')
    // vid.setAttribute('autoplay', '')
    // vid.setAttribute('width', '200px')
    // vid.setAttribute('height', '200px')
    // vid.style.position = 'absolute'
    // vid.style.zIndex = '10000'
    let blob = new Blob(this.chunks, { type: "video/webm" })
    vid.src = URL.createObjectURL(blob)
    // document.body.appendChild(vid)
  }

  switchPlaying(): void {
    if (this.playing) {
      this.stopPlaying()
    } else {
      this.startPlaying()
    }
  }

  startPlaying(): void {
    let vid = this.host.nativeElement.querySelector(".result")
    this.playing = true
    vid.play()
    this.progress.interval = setInterval(() => {
      let v = this.host.nativeElement.querySelector(".result")
      this.progress.value = v.currentTime/this.duration
    }, 100)
  }

  stopPlaying(): void {
    let vid = this.host.nativeElement.querySelector(".result")
    this.playing = false
    vid.pause()
    clearInterval(this.progress.interval)
  }

  ngOnInit(): void {
    this.initRecord()
  }

  ngOnDestroy(): void {
    this.uninit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recording'] && changes['recording'].previousValue !== changes['recording'].currentValue && changes['recording'].previousValue !== undefined) {
      if (this.recording) {
        this.startRecord()
      } else {
        this.stopRecord()
      }
    }

    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      if (this.value[0]) {
        this.chunks = this.value
      }
    }

    if (changes['screen'] && changes['screen'].previousValue !== changes['screen'].currentValue) {
      if (this.screen === 'recording') {
        this.initRecord()
      } else if (this.screen === 'watching') {
        setTimeout(() => {
          this.createVideo()
        }, 100)
      }
    }

    if (changes['sublimeuninit'] && changes['sublimeuninit'].previousValue !== changes['sublimeuninit'].currentValue && changes['sublimeuninit'].previousValue !== undefined) {
      this.uninit()
    }
  }

}

import { Component, OnInit, ElementRef, HostBinding, HostListener, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-web-camera',
  templateUrl: './web-camera.component.html',
  styleUrls: ['./web-camera.component.scss']
})
export class WebCameraComponent implements OnInit {

  @Input() setinit: boolean = false

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

  @Output() save: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()

  @HostBinding('style.backgroundColor') backgroundColor: string = '#ffffff'
  public opacityVideo: string = '0'

  constructor(
    private host: ElementRef,
    public locationService: LocationService
  ) { }

  @HostListener('click') onClick(): void {
    if (this.confirm === '') {
      if (this.status === 'waiting') {
        this.startRecord()
      } else if (this.status === 'recording') {
        this.stopRecord()
      }
    }

  }

  async init(): Promise<MediaStream> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    } else {
      return new Promise((res:any, rej: any) => rej("Your browser does not support microphone recording"))
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

  startRecord(): void {
    if (this.chunks[0]) {
      this.confirm = this.locationService.translate('Overwrite?', 'Перезаписать?')
      return
    }
    this.timer = 30
    this.interval = setInterval(() => {
      this.timer--
      if (this.timer <= 0) this.stopRecord()
    }, 1000)
    this.status = 'recording'
    this.text = this.locationService.translate('tap to stop record', 'нажать чтобы остановить запись')
    this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(1) > animate').beginElement()
    this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(2) > animate').beginElement()
    setTimeout(() => {
      this.recorder.start()
    }, 100)
  }

  stopRecord(): void {
    clearInterval(this.interval)
    this.status = 'waiting'
    this.timer = 0
    this.text = this.locationService.translate('tap to start record', 'нажать чтобы начать запись')
    this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(1) > animate').endElement()
    this.host.nativeElement.querySelector('.hint > .rec > circle:nth-child(2) > animate').endElement()
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

  async start(): Promise<void> {
    try {
      let stream = await this.init()
      let preview = this.host.nativeElement.querySelector(".preview")
      preview.setAttribute("muted", "true")
      preview.srcObject = stream
      preview.captureStream = preview.captureStream || preview.mozCaptureStream
      preview.onplay = () => {
        this.text = this.locationService.translate('tap to start record', 'нажать чтобы начать запись')
        this.backgroundColor = '#000000'
        this.opacityVideo = '1'
        this.setSize()
        this.status = 'waiting'
        this.loading = false
      }

      this.recorder = new MediaRecorder(stream)
      this.recorder.ondataavailable = (e: any) => {
        this.chunks.push(e.data)
        this.save.emit(this.chunks)
        // this.createVideo()
      }
    } catch (err) {
      if ((err as string).toString() === 'NotAllowedError: Permission denied' || (err as string).toString() === 'NotAllowedError: Permission dismissed') {
        this.error = this.locationService.translate('Webcam not allowed', 'Веб-камера недоступна')
      } else {
        this.error = err as string
      }
    }
  }

  uninit(): void {
    this.recorder.stream.getTracks().forEach(track => track.stop())
  }

  createVideo(): void {
    let vid = document.createElement('video')
    vid.setAttribute('control', '')
    vid.setAttribute('autoplay', '')
    vid.setAttribute('width', '200px')
    vid.setAttribute('height', '200px')
    vid.style.position = 'absolute'
    vid.style.zIndex = '10000'
    let blob = new Blob(this.chunks, { type: "video/webm" })
    vid.src = URL.createObjectURL(blob)
    document.body.appendChild(vid)
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setinit'] && changes['setinit'].previousValue !== changes['setinit'].currentValue && changes['setinit'].previousValue !== undefined) {
      if (changes['setinit'].currentValue) {
        this.start()
      } else {
        if (this.status !== 'none') this.uninit()
      }
    }
  }

}

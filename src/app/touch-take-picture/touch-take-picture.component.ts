import { Component, OnInit, Input, Output, EventEmitter, ElementRef, SimpleChanges, HostListener } from '@angular/core'
import { AsyncService } from '../async.service'
import { Touch2Service, Touch } from '../services/touch2.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-take-picture',
  templateUrl: './touch-take-picture.component.html',
  styleUrls: ['./touch-take-picture.component.scss']
})
export class TouchTakePictureComponent implements OnInit {

  @Input() active: boolean = false
  @Output() save: EventEmitter<string> = new EventEmitter<string>()

  public width: number = 0
  public height: number = 0

  public picture: string = ''

  public chickchick: boolean = false

  public opacityVideo: string = '0'
  public opacityPhoto: string = '0'

  public error: string = ''

  private recorder!: MediaRecorder

  private obs!: any

  private canMove: boolean = false

  public ycoord: number = 0
  private memory: number = 0

  private velocity: number = 0
  private timeoutvelocity: any = setTimeout(() => {}, 0)

  public loading: boolean = true

  constructor(
    private asyncService: AsyncService,
    private host: ElementRef,
    private touch2Service: Touch2Service,
    public locationService: LocationService
  ) { }

  @HostListener('click') onClick(): void {
    if (this.opacityPhoto === '0') {
      const vid = this.host.nativeElement.querySelector(".preview")
      const photo = this.host.nativeElement.querySelector(".photo")
      this.takePhoto()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.setAttribute('width', vid.videoWidth+'px')
      canvas.setAttribute('height', vid.videoHeight+'px')
      ctx!.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight)
      this.picture = canvas.toDataURL('png/image', 1)
      // photo.style.backgroundImage = 'url('+canvas.toDataURL('png/image', 1)+')'
    } else if (this.opacityPhoto === '1') {
      this.opacityPhoto = '0'
      this.opacityVideo = '1'
      this.save.emit(this.picture)
    }
  }

  async init(): Promise<MediaStream> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    } else {
      return new Promise((res:any, rej: any) => rej("Your browser does not support microphone recording"))
    }
  }

  async takePhoto(): Promise<void> {
    this.chickchick = true
    await this.asyncService.delay(1000)
    this.chickchick = false
    this.opacityPhoto = '1'
    this.opacityVideo = '0'
    this.ycoord = 0
    await this.asyncService.delay(300)
    return new Promise(res => res())
  }

  async start(): Promise<void> {
    try {
      let stream = await this.init()
      let preview = this.host.nativeElement.querySelector(".preview")
      preview.srcObject = stream
      preview.captureStream = preview.captureStream || preview.mozCaptureStream
      preview.onplay = () => {
        this.setSize()
        this.opacityVideo = '1'
        this.loading = false
      }

      this.recorder = new MediaRecorder(stream)
      // this.recorder.ondataavailable = (e: any) => {
      //   console.log(e.data)
      //   // this.save.emit(e.data)
      // }
    } catch (err) {
      if ((err as string).toString() === 'NotAllowedError: Permission denied' || (err as string).toString() === 'NotAllowedError: Permission dismissed') {
        this.error = this.locationService.translate('Webcam not allowed', 'Камера недоступна')
      } else {
        this.error = err as string
      }
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

  uninit(): void {
    this.recorder.stream.getTracks().forEach(track => track.stop())
  }

  async closePhoto(): Promise<void> {
    this.host.nativeElement.querySelector('.photo').style.transition = 'all ease 0.3s'
    this.ycoord = -window.innerHeight
    await this.asyncService.delay(300)
    this.opacityPhoto = '0'
    this.picture = ''
    this.opacityVideo = '1'
    await this.asyncService.delay(300)
    this.host.nativeElement.querySelector('.photo').style.removeProperty('transition')
    return new Promise(res => res())
  }

  async remainPhoto(): Promise<void> {
    this.host.nativeElement.querySelector('.photo').style.transition = 'all ease 0.3s'
    await this.asyncService.delay(10)
    this.ycoord = 0
    await this.asyncService.delay(300)
    this.host.nativeElement.querySelector('.photo').style.removeProperty('transition')
    return new Promise(res => res())
  }

  processTouch(t: Touch): void {
    if (t.action === 'move' && t.prev!.action === 'start') {
      if (Math.abs(t.x-t.prev!.x) < Math.abs(t.y-t.prev!.y)) {
        this.canMove = true
        this.memory = this.ycoord
      } else {
        this.canMove = false
      }
    }

    if (t.action === 'move' && this.canMove && this.opacityPhoto === '1') {
      this.velocity = t.y-t.prev!.y
      clearTimeout(this.timeoutvelocity)
      this.timeoutvelocity = setTimeout(() => {
        this.velocity = 0
      }, 100)
      let y = this.memory+(t.y-t.start!.y)
      if (y > 0) y = 0
      if (y < -window.innerHeight/2) y = -window.innerHeight/2
      this.ycoord = y
    }

    if (t.action === 'end' && this.canMove && this.opacityPhoto === '1') {
      if (this.velocity === 0) {
        if (this.ycoord < -window.innerHeight/4) {
          this.closePhoto()
        } else if (this.ycoord > -window.innerHeight/4) {
          this.remainPhoto()
        }
      } else {
        if (this.velocity > 0) {
          this.remainPhoto()
        } else if (this.velocity < 0) {
          this.closePhoto()
        }
      }
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active'] && changes['active'].previousValue !== changes['active'].currentValue && changes['active'].previousValue != undefined) {
      if (changes['active'].currentValue) {
        this.start()
        this.obs = this.touch2Service.listen(this.host.nativeElement).subscribe((t: Touch) => this.processTouch(t))
      } else {
        this.uninit()
        this.obs.unsubscribe()
      }
    }
  }

}

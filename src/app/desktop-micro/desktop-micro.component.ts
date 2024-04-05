import { Component, OnInit, HostListener, ElementRef, Output, EventEmitter, SimpleChanges, Input, ViewChild } from '@angular/core'
import { AsyncService } from '../async.service'
import { GetTargetHtmlService } from '../services/get-target-html.service'
import { trigger, state, style, animate, transition, stagger, query, group } from '@angular/animations'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-desktop-micro',
  templateUrl: './desktop-micro.component.html',
  styleUrls: ['./desktop-micro.component.scss'],
  animations: [
    trigger('popup', [
      state('open', style({
        display: 'flex',
        transform: 'translateX(-30px) translateY(80px)',
        opacity: '1'
      })),
      state('close', style({
        transform: 'translateX(-30px) translateY(50px)',
        opacity: '0',
        display: 'none'
      })),
      transition('open <=> close', animate('0.2s ease'))
    ])
  ]
})
export class DesktopMicroComponent implements OnInit {

  public status: string = 'waiting'
  public error: string = ''

  public sounds: Array<number> = []
  public recorder!: MediaRecorder

  public chunks: Array<any> = []

  public showConfirm: string = 'close'

  public playing: boolean = false

  private audioCtx!: AudioContext
  private analyser!: AnalyserNode

  public timer: number = 0
  public interval: any = setInterval(() => {}, 1000000)

  private audio!: any

  public progress: number = 0

  public intervalPlaying = setInterval(() => {}, 1000000)

  public widthProgress: number = 0

  public audioDuration: number = 0

  public trackConfig: any = {
    active: false,
    wasPlaying: false
  }

  textError: string =''
  timeoutError: any = setTimeout(() => {}, 0)

  @Input() withoutRecord: boolean = false
  @Input() sublimeValue: any = null
  @Input() sublimeSounds: any = null
  @Input() sublimeDuration: any = null

  @ViewChild('confirm') confirmRef!: ElementRef

  @ViewChild('progress') progressRef!: ElementRef

  @Input() sublimestop: boolean = false

  @Output() save: EventEmitter<{ chunks: Array<any>, sounds: Array<number>, duration: number }> = new EventEmitter<{ chunks: Array<any>, sounds: Array<number>, duration: number }>()

  constructor(
    private asyncService: AsyncService,
    private host: ElementRef,
    private getTargetHtmlService: GetTargetHtmlService,
    public locationService: LocationService
  ) { }

  showError(text: string) {
    clearTimeout(this.timeoutError)
    this.textError = text
    this.timeoutError = setTimeout(() => {
      this.textError = ''
    }, 5000)
  }

  async init(): Promise<MediaStream> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({ audio: true })
    } else {
      return new Promise((res:any, rej: any) => rej("Your browser does not support microphone recording"))
    }
  }

  @HostListener('window:click', ['$event']) onMouseClick(e: any) {
    if (this.showConfirm === 'open' && !this.confirmRef.nativeElement.contains(e.target)) {
      this.showConfirm = 'close'
    }
  }

  onMouseDownTrack(e: any): void {
    this.trackConfig.active = true
    this.trackConfig.wasPlaying = this.playing
    if (this.playing) this.stopPlaying()

    let rectTrack = this.progressRef.nativeElement.getBoundingClientRect()

    this.progress = (e.clientX-rectTrack.x)/rectTrack.width
    this.widthProgress = this.progress*rectTrack.width
    if (this.widthProgress > rectTrack.width) this.widthProgress = rectTrack.width
    this.audio.currentTime = this.progress*this.audioDuration
  }

  onMouseMoveTrack(e: any): void {
    if (!this.trackConfig.active) return

    let rectTrack = this.progressRef.nativeElement.getBoundingClientRect()

    this.progress = (e.clientX-rectTrack.x)/rectTrack.width
    this.widthProgress = this.progress*rectTrack.width
    if (this.widthProgress > rectTrack.width) this.widthProgress = rectTrack.width
    this.audio.currentTime = this.progress*this.audioDuration
  }

  onMouseUpTrack(e: any): void {
    this.trackConfig.active = false
    if (this.trackConfig.wasPlaying) this.startPlaying()
  }

  onMouseLeave(): void {
    this.trackConfig.active = false
  }

  async startRecord(): Promise<void> {
    if (this.chunks[0]) {
      setTimeout(() => {
        this.showConfirm = 'open'
      }, 30)
      return
    }
    try {
      this.widthProgress = 0

      let stream = await this.init()

      this.audioCtx = new AudioContext()
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 2048

      this.audioCtx.createMediaStreamSource(stream).connect(this.analyser)

      this.recorder = new MediaRecorder(stream)
      this.status = 'recording'
      this.recorder.ondataavailable = (e: any) => {
        this.chunks.push(e.data)
        this.save.emit({
          chunks: this.chunks,
          sounds: this.sounds,
          duration: this.audioDuration
        })
      }
      this.recorder.start()
      this.listen()

      this.timer = 50
      this.interval = setInterval(() => {
        this.timer--
        if (this.timer <= 0) this.stopRecord()
      }, 1000)
    } catch (err) {
      if ((err as string).toString() === 'NotAllowedError: Permission denied' || (err as string).toString() === 'NotAllowedError: Permission dismissed') {
        this.error = "Microphone not allowed"
      } else {
        this.error = err as string
      }
      this.showError(this.error)
    }
  }

  async stopRecord(): Promise<void> {
    this.audioDuration = 50-this.timer
    this.timer = 0
    clearInterval(this.interval)
    this.status = 'waiting'
    this.recorder.stop()
    this.recorder.stream.getTracks().forEach(track => track.stop())
    let [t, max] = [0, 10]
    while (!this.chunks[0]) {
      await this.asyncService.delay(500)
      t++
      if (t > max) break
    }
    if (t < max) {
      this.audio = new Audio(URL.createObjectURL(this.chunks[0]))
      this.audio.onended = () => {
        this.stopPlaying()
      }
    }
    return new Promise(res => res())
  }

  async listen(): Promise<any> {
    while (this.status === 'recording') {
      let data = new Uint8Array(this.analyser.frequencyBinCount)
      this.analyser.getByteFrequencyData(data)
      let rms = 0
      for (var i = 0; i < data.length; i++) {
        rms += data[i]**2
      }
      rms = rms/data.length;
      rms = Math.sqrt(rms)
      this.addSound(rms)
      await this.asyncService.delay(200)
    }
  }

  addSound(rms: number): void {
    rms /= 2
    this.sounds.push(rms)
    if (this.sounds.length > 150) {
      for (let i = 0; i < this.sounds.length; i+=2) this.sounds.splice(i, 1)
    }
  }

  resultconfirm(res: string) {
    if (res === 'agree') {
      this.chunks = []
      this.sounds = []
      this.startRecord()
    }
    this.showConfirm = 'close'
  }

  switchRecord(): void {
    if (this.playing || this.showConfirm === 'open') return

    if (this.status === 'waiting') {
      this.startRecord()
    } else {
      this.stopRecord()
    }
  }

  switchPlay(): void {
    if (!this.chunks[0] || this.status === 'recording' || this.showConfirm === 'open') return

    if (!this.playing) {
      this.startPlaying()
    } else {
      this.stopPlaying()
    }
  }

  startPlaying(): void {
    this.playing = true
    this.audio.play()

    this.intervalPlaying = setInterval(() => {
      this.progress = this.audio.currentTime/this.audioDuration
      let rectTrack = this.progressRef.nativeElement.getBoundingClientRect()
      this.widthProgress = this.progress*rectTrack.width
      if (this.widthProgress > rectTrack.width) this.widthProgress = rectTrack.width
    }, 100)
  }

  stopPlaying(): void {
    this.playing = false
    this.audio.pause()
    clearInterval(this.intervalPlaying)
  }

  // makePlayer(): void {
  //   const audio = document.createElement('audio')
  //   // audio.setAttribute('controls', '')
  //   audio.controls = true
  //   audio.setAttribute('style', 'position:absolute;z-index:100;')
  //   const blob = new Blob(this.chunks, { type:'audio/mp3' })
  //   const audioURL = window.URL.createObjectURL(blob)
  //   audio.src = audioURL
  //   document.body.appendChild(audio)
  // }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sublimestop'] && changes['sublimestop'].previousValue !== changes['sublimestop'].currentValue && changes['sublimestop'].previousValue !== undefined) {
      this.stopRecord()
    }

    if (changes['sublimeValue'] && changes['sublimeValue'].previousValue !== changes['sublimeValue'].currentValue && this.sublimeValue[0]) {
      this.chunks = this.sublimeValue
      this.audio = new Audio(URL.createObjectURL(this.chunks[0]))
      this.audio.onended = () => {
        this.stopPlaying()
      }
    }

    if (changes['sublimeSounds'] && changes['sublimeSounds'].previousValue !== changes['sublimeSounds'].currentValue && this.sublimeSounds) {
      this.sounds = this.sublimeSounds
    }

    if (changes['sublimeDuration'] && changes['sublimeDuration'].previousValue !== changes['sublimeDuration'].currentValue && this.sublimeDuration) {
      this.audioDuration = this.sublimeDuration
    }
  }

}

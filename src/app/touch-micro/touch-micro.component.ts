import { Component, OnInit, HostListener, ElementRef, Output, EventEmitter, SimpleChanges, Input } from '@angular/core'
import { AsyncService } from '../async.service'
import { GetTargetHtmlService } from '../services/get-target-html.service'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-touch-micro',
  templateUrl: './touch-micro.component.html',
  styleUrls: ['./touch-micro.component.scss']
})
export class TouchMicroComponent implements OnInit {

  public status: string = 'waiting'
  public error: string = ''

  public sounds: Array<number> = []
  public recorder!: MediaRecorder

  public chunks: Array<any> = []

  public confirm: string = ''

  private audioCtx!: AudioContext
  private analyser!: AnalyserNode

  public timer: number = 0
  public interval: any = setInterval(() => {}, 1000000)

  @Input() sublimestop: boolean = false

  @Output() save: EventEmitter<Array<any>> = new EventEmitter<Array<any>>()

  constructor(
    private asyncService: AsyncService,
    private host: ElementRef,
    private getTargetHtmlService: GetTargetHtmlService,
    public locationService: LocationService
  ) { }

  @HostListener("click", ['$event'])
  onClick(e: any): void {
    if (this.getTargetHtmlService.get(e.target, 'APP-TOUCH-CONFIRM') === null) {
      if (this.status === 'waiting') {
        this.start()
      } else if (this.status === 'recording') {
        this.stop()
      }
    }
  }

  async init(): Promise<MediaStream> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia({ audio: true })
    } else {
      return new Promise((res:any, rej: any) => rej("Your browser does not support microphone recording"))
    }
  }

  async start(): Promise<void> {
    if (this.chunks[0]) {
      this.confirm = "Overwrite?"
      return
    }
    try {
      let stream = await this.init()

      this.audioCtx = new AudioContext()
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 2048

      this.audioCtx.createMediaStreamSource(stream).connect(this.analyser)

      this.recorder = new MediaRecorder(stream)
      this.status = 'recording'
      this.recorder.ondataavailable = (e: any) => {
        this.chunks.push(e.data)
        this.save.emit(this.chunks)
      }
      this.recorder.start()
      this.listen()

      this.timer = 50
      this.interval = setInterval(() => {
        this.timer--
        if (this.timer <= 0) this.stop()
      }, 1000)
    } catch (err) {
      if ((err as string).toString() === 'NotAllowedError: Permission denied' || (err as string).toString() === 'NotAllowedError: Permission dismissed') {
        this.error = this.locationService.translate('Microphone not allowed', 'Микрофон недоступен')
      } else {
        this.error = err as string
      }
    }
  }

  stop(): void {
    this.timer = 0
    clearInterval(this.interval)
    this.status = 'waiting'
    this.recorder.stop()
    this.recorder.stream.getTracks().forEach(track => track.stop())
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
    // rms /= 3
    this.sounds.push(rms)
  }

  resultconfirm(res: string) {
    if (res === 'agree') {
      this.chunks = []
      this.sounds = []
      this.start()
    } else if (res === 'reject') {
      this.confirm = ""
    }
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
      this.stop()
    }
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { trigger, state, transition, style, animate } from '@angular/animations'
import { ReadFileService } from '../services/read-file.service'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-desktop-list-images',
  templateUrl: './desktop-list-images.component.html',
  styleUrls: ['./desktop-list-images.component.scss'],
  animations: [
    trigger('rightShow', [
      transition(':enter', [
        style({ transform: 'translateX(min(600px, 100%))' }),
        animate('200ms ease', style({ transform: 'translateX(0px)' })),
      ]),
      transition(':leave', [
        animate('200ms ease', style({ transform: 'translateX(min(600px, 100%))' }))
      ])
    ])
  ]
})
export class DesktopListImagesComponent implements OnInit {

  @Input() images: Array<string> = []

  @Output() choose: EventEmitter<string> = new EventEmitter<string>()

  textError: string = ''

  private timeoutError: any = setTimeout(() => {}, 0)

  constructor(
    private readfileservice: ReadFileService,
    private asyncService: AsyncService
  ) { }

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
      this.choose.emit(img.src)
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

  ngOnInit(): void {
  }

}

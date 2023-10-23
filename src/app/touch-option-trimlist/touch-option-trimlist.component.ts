import { Component, OnInit, Input, SimpleChanges, ElementRef, HostBinding } from '@angular/core'
import { ReadFileService } from '../services/read-file.service'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-touch-option-trimlist',
  templateUrl: './touch-option-trimlist.component.html',
  styleUrls: ['./touch-option-trimlist.component.scss']
})
export class TouchOptionTrimlistComponent implements OnInit {

  @Input() value: string = ''
  // @Input() check: boolean = false
  private image!: any
  @HostBinding('style.backgroundSize') backgroundsize: string = '90% auto'
  @HostBinding('style.backgroundImage') backgroundImage: string = 'url('+this.value+')'

  // public checkdisplay: string = 'none'
  // public checkopacity: string = '0'
  // public checktransform: string = 'translateY(-20px)'

  constructor(
    private readgileservice: ReadFileService,
    private host: ElementRef,
    private asyncservice: AsyncService
  ) { }

  setsize(): void {
    if (this.image.naturalWidth >= this.image.naturalHeight) {
      if (this.image.naturalWidth < 0.9*130) {
        this.backgroundsize = `${this.image.naturalWidth}px auto`
      } else {
        this.backgroundsize = '90% auto'
      }
    } else {
      if (this.image.naturalHeight < 0.9*130) {
        this.backgroundsize = `${this.image.naturalHeight}px auto`
      } else {
        this.backgroundsize = 'auto 90%'
      }
    }
  }

  // async showcheck(): Promise<void> {
  //   this.checkdisplay = 'flex'
  //   this.asyncservice.delay(10)
  //   this.checkopacity = '1'
  //   this.checktransform = 'translateY(0px)'
  //   this.asyncservice.delay(300)
  //   return new Promise(res => res())
  // }
  //
  // async hidecheck(): Promise<void> {
  //   this.checkopacity = '0'
  //   this.checktransform = 'translateY(-20px)'
  //   this.asyncservice.delay(300)
  //   this.checkdisplay = 'none'
  //   return new Promise(res => res())
  // }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].previousValue !== changes['value'].currentValue) {
      this.readgileservice.getImageByUrl(this.value).then(d => {
        this.image = d
        this.backgroundImage = 'url('+this.value+')'
        this.setsize()
      })
    }
    // if (changes['check'] && changes['check'].previousValue !== changes['check'].currentValue) {
    //   if (changes['check'].currentValue) {
    //     this.showcheck()
    //   } else {
    //     this.hidecheck()
    //   }
    // }
  }

}

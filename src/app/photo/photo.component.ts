import { Component, OnInit, Input, SimpleChanges, HostBinding, ElementRef } from '@angular/core'
import { LinerSvgService } from '../services/liner-svg.service'

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {

  @Input() size: number = 100
  @Input() photo: string = '../../assets/photo/example.jpg'
  @Input() sign: Array<any> = []

  @Input() @HostBinding('class.smooth') smooth: boolean = false

  private ratio1: number = 48/64
  private ratio2: number = 48/0.1

  public width: number = this.size
  public height: number = this.size/this.ratio1
  public depth: number = this.size/this.ratio2

  setSize(): void {
    this.width = this.size
    this.height = this.size/this.ratio1
    this.depth = this.size/this.ratio2
    setTimeout(() => {
      this.setSign()
    }, 50)
  }

  constructor(
    private linerSvgService: LinerSvgService,
    private host: ElementRef
  ) { }

  setSign(): void {
    let svg = this.linerSvgService.getSvg(this.width, this.height, this.sign)
    this.host.nativeElement.querySelector(".back > .sign").innerHTML = ''
    this.host.nativeElement.querySelector(".back > .sign").innerHTML = svg.outerHTML
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size'] && changes['size'].previousValue !== changes['size'].currentValue) {
      this.setSize()
    }

    if (changes['sign'] && changes['sign'].previousValue !== changes['sign'].currentValue) {
      this.setSign()
    }
  }

}

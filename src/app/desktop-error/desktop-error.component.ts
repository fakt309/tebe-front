import { Component, OnInit, OnChanges, Input, SimpleChanges, HostBinding } from '@angular/core'
import { trigger, state, transition, style, animate } from '@angular/animations'

@Component({
  selector: 'app-desktop-error',
  templateUrl: './desktop-error.component.html',
  styleUrls: ['./desktop-error.component.scss'],
  animations: [
    trigger('buttomShow', [
      state('show', style({ transform: 'translateX(-50%) translateY(0px)' })),
      state('hide', style({ transform: 'translateX(-50%) translateY(200px)' })),
      transition('hide => show', [animate('200ms ease')]),
      transition('show => hide', [animate('200ms ease')])
    ])
  ]
})
export class DesktopErrorComponent implements OnInit, OnChanges {

  @Input() text: string = ''
  @Input() color: string = '#333333'

  @HostBinding('@buttomShow') visible: string = 'hide'

  insideText: string = ''

  timeout = setTimeout(() => {}, 0)

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && changes['text'].previousValue !== undefined) {
      if (this.text === '') {
        clearTimeout(this.timeout)
        this.visible = 'hide'
      } else {
        this.insideText = this.text
        this.visible = 'show'
      }
    }
  }

}

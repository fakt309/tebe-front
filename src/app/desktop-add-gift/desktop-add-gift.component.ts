import { Component, OnInit, Output, EventEmitter, HostBinding } from '@angular/core'
import { trigger, state, style, animate, transition, query, group } from '@angular/animations'
import { LocationService } from '../services/location.service'

@Component({
  selector: 'app-desktop-add-gift',
  templateUrl: './desktop-add-gift.component.html',
  styleUrls: ['./desktop-add-gift.component.scss']
})
export class DesktopAddGiftComponent implements OnInit {

  @HostBinding('style.backgroundColor') backgroundColor: string = '#00000066'

  margin: number = 400

  scroll: number = 0

  dialogs: any = {
    greetingcard: { visible: false },
    game: { visible: false },
    speaker: { visible: false },
    tablet: { visible: false },
    photo: { visible: false },
  }

  gifts: Array<{ type: string; position: number; opacity: number; scale: number; descr: boolean }> = [
    { type: 'greetingcard', position: 0, opacity: 0, scale: 1, descr: false },
    { type: 'game', position: 0, opacity: 0, scale: 1, descr: false },
    { type: 'speaker', position: 0, opacity: 0, scale: 1, descr: false },
    { type: 'tablet', position: 0, opacity: 0, scale: 1, descr: false },
    { type: 'photo', position: 0, opacity: 0, scale: 1, descr: false }
  ]

  @Output() close: EventEmitter<string> = new EventEmitter<string>()

  constructor(
    public locationService: LocationService
  ) {}

  setPositions(delta: number): void {

    this.scroll -= delta/2

    if (this.scroll > this.gifts.length*this.margin) {
      this.scroll -= this.gifts.length*this.margin
    }

    if (this.scroll < 0) {
      this.scroll += this.gifts.length*this.margin
    }

    for (let i = 0; i < this.gifts.length; i++) {

      this.gifts[i].position = this.scroll+i*this.margin

      if (this.gifts[i].position-this.margin/2 > window.innerHeight/2) {
        this.gifts[i].position = this.scroll-(this.gifts.length-i)*this.margin
      }

      if (Math.abs(this.gifts[i].position) <= 100) {
        this.gifts[i].descr = true
        this.gifts[i].opacity = 1
        this.gifts[i].scale = 1
      } else {
        this.gifts[i].descr = false
        this.gifts[i].opacity = (1-Math.abs(this.gifts[i].position)/(window.innerHeight/2))
        this.gifts[i].scale = (1-Math.abs(this.gifts[i].position)/(window.innerHeight/2))
      }
    }
  }

  scrollTo(can: boolean, index: number): void {
    if (!can) return

    this.scroll = -index*this.margin
    this.setPositions(0)
  }

  showHowItWorks(type: string): void {
    // this.close.emit('')
    this.backgroundColor = '#00000000'
    this.dialogs[type].visible = true
  }

  closeHowItWorks(type: string): void {
    this.backgroundColor = '#00000066'
    this.dialogs[type].visible = false
  }

  ngOnInit(): void {
    this.setPositions(0)
  }

}

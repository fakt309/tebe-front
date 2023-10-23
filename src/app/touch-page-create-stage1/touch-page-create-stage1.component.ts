import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core'
import { TouchService, Touch } from '../touch.service'
import { OptionMenu } from '../touch-menu/touch-menu.component'
import { GetTargetHtmlService } from '../services/get-target-html.service'
import { AsyncService } from '../async.service'
import { ReadFileService } from '../services/read-file.service'
import { LinerSvgService } from '../services/liner-svg.service'
import { Subscription } from 'rxjs'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { LocationService } from '../services/location.service'
import { ActivatedRoute, Params } from '@angular/router'

@Component({
  selector: 'app-touch-page-create-stage1',
  templateUrl: './touch-page-create-stage1.component.html',
  styleUrls: ['./touch-page-create-stage1.component.scss']
})
export class TouchPageCreateStage1Component implements OnInit, OnDestroy {

  private subs: Array<Subscription> = []

  public touches: any = {
    giftslist: null,
    menu: null,
    screenadd: null,
    screenviewgift: null,
    screentrim: null,
    screenlisttrim: null,
    screensigngreeting: null,
    screenplatformgame: null,
    screenrecordaudio: null,
    screenlistenaudio: null,
    screencolorplate: null,
    screenrecordvideo: null,
    screenwatchvideo: null,
    screentakephoto: null,
    screensignphoto: null,
    screenhowitworks: null
  }
  public disableds: any = {
    giftslist: false,
    menu: false,
    screenadd: true,
    screenviewgift: true,
    screentrim: true,
    screenlisttrim: true,
    screensigngreeting: true,
    screenplatformgame: true,
    screenrecordaudio: true,
    screenlistenaudio: true,
    screencolorplate: true,
    screenrecordvideo: true,
    screenwatchvideo: true,
    screentakephoto: true,
    screensignphoto: true,
    screenhowitworks: true
  }
  public stats: any = {
    menu: 'close',
    screenadd: 'close',
    screenviewgift: 'close',
    screentitle: 'close',
    screentrim: 'close',
    screenlisttrim: 'close',
    screensigngreeting: 'close',
    screenplatformgame: 'close',
    screenrecordaudio: 'close',
    screenlistenaudio: 'close',
    screencolorplate: 'close',
    screenrecordvideo: 'close',
    screenwatchvideo: 'close',
    screentakephoto: 'close',
    screensignphoto: 'close',
    screenhowitworks: 'close'
  }
  public menu: Array<OptionMenu> = [
    {
      title: this.locationService.translate('add', 'добавить'),
      ico: '../../assets/plus.svg',
      value: 'add'
    }
  ]
  public menusublimeshow: boolean = false
  public gifts: Array<any> = []
  public activeGift: any = null

  public moveWithWaiting: boolean = false
  public timeoutMoveWithWaiting: any = setTimeout(() => {}, 0)

  public valerror: string = ''
  public timeoutError: any = setTimeout(() => {}, 0)

  public sublimerefreshviewgift: boolean = false

  public renamemax: number = 1000
  public renamemin: number = 3
  public renamewhat: string = ''
  public renamevalue: string = ''

  public optionListGiftAnimated: boolean = false

  public modeviewgift: string = 'usual'

  public modetrim: string = 'usual'
  public imgtrim: string = ''
  public sublimesavetrim: boolean = false
  public hashedtrim: string | null = null
  public listtrim: string = ''
  public ratiotrim: number = 1/1

  public enterablerename: boolean = false

  public refreshsnapshots: boolean = false

  public sublimerefreshplatform: boolean = false
  public sublimerefreshcolorplate: boolean = false

  public sublimestoprecordaudio: boolean = false

  public signgreetingtool: 'pen' | 'eraser' = 'pen'
  public signgreetingcolor: string = '#ffffff'
  public signgreetingsublimereset: boolean = false
  public signgreetingsublimesave: boolean = false

  public signphotosublimereset: boolean = false
  public signphotosublimesave: boolean = false

  public initrecordvideo: boolean = false

  public activewatchvideo: boolean = false
  public activetakephoto: boolean = false
  public activesignphoto: boolean = false

  public confirm: any = {
    value: '',
    type: ''
  }

  public showSelectLanguage: boolean = false

  constructor(
    private touchservice: TouchService,
    private gettargethtml: GetTargetHtmlService,
    private asyncservice: AsyncService,
    private host: ElementRef,
    private readfileservice: ReadFileService,
    private linersvgservice: LinerSvgService,
    public locationService: LocationService,
    private route: ActivatedRoute
  ) {
  }

  processtouch(t: Touch): void {

    this.setdisableds(t)

    Object.keys(this.touches).forEach((k: string) => { this.touches[k] = null })

    if (!this.disableds.giftslist) this.touches.giftslist = t
    if (!this.disableds.menu) this.touches.menu = t
    if (!this.disableds.screenadd) this.touches.screenadd = t
    if (!this.disableds.screenviewgift) this.touches.screenviewgift = t
    if (!this.disableds.screentrim) this.touches.screentrim = t
    if (!this.disableds.screenlisttrim) this.touches.screenlisttrim = t
    if (!this.disableds.screensigngreeting) this.touches.screensigngreeting = t
    if (!this.disableds.screenplatformgame) this.touches.screenplatformgame = t
    if (!this.disableds.screenrecordaudio) this.touches.screenrecordaudio = t
    if (!this.disableds.screenlistenaudio) this.touches.screenlistenaudio = t
    if (!this.disableds.screencolorplate) this.touches.screencolorplate = t
    if (!this.disableds.screenrecordvideo) this.touches.screenrecordvideo = t
    if (!this.disableds.screenwatchvideo) this.touches.screenwatchvideo = t
    if (!this.disableds.screentakephoto) this.touches.screentakephoto = t
    if (!this.disableds.screensignphoto) this.touches.screensignphoto = t
    if (!this.disableds.screenhowitworks) this.touches.screenhowitworks = t


    // Object.keys(this.stats).forEach((k: string) => {
    //   if (this.stats[k] === 'open') {
    //     console.log(k, this.stats[k])
    //   }
    // })
    // Object.keys(this.disableds).forEach((k: string) => {
    //   if (!this.disableds[k]) {
    //     console.log(k, this.disableds[k])
    //   }
    // })
    // Object.keys(this.touches).forEach((k: string) => {
    //   if (this.touches[k] !== null) {
    //     console.log(k, this.touches[k])
    //   }
    // })
    // console.log('------------')

    // if (t.action === 'end' && this.disableds.screenadd && this.disableds.screenviewgift) {
    //   this.disableds.giftslist = false
    //   this.disableds.menu = false
    // }

    if (t.action === 'start') {
      clearTimeout(this.timeoutMoveWithWaiting)
      this.timeoutMoveWithWaiting = setTimeout(() => {
        this.moveWithWaiting = true
      }, 400)
    }

    if (t.action === 'move') {
      clearTimeout(this.timeoutMoveWithWaiting)
    }

    if (t.action === 'end') {
      this.moveWithWaiting = false
      this.optionListGiftAnimated = false
    }

    //dbl click
    if (t.action === 'end' && t.drag === false) {
      if (this.flagdbl) {
        this.dbltap()
        this.flagdbl = false
      } else {
        clearTimeout(this.timeoutdbl)
        this.flagdbl = true
        this.timeoutdbl = setTimeout(() => {
          this.flagdbl = false
        }, 200)
      }
    }
  }

  private flagdbl = false
  private timeoutdbl = setTimeout(() => {}, 0)
  dbltap(): void {
    if (this.stats.screenviewgift === 'open') {
      if (this.modeviewgift == 'usual') {
        this.modeviewgift = 'review'
        this.menu = []
      } else if (this.modeviewgift == 'review') {
        this.modeviewgift = 'usual'
        this.setmenuviewgift()
      }
    }
  }

  getGiftId(): number {
    let max = 0
    this.gifts.forEach(g => {
      if (g.id > max) max = g.id
    })
    return max+1
  }

  addgifttolist(t: string) {
    let gift: any = {}

    gift.id = this.getGiftId()

    if (t === 'greetingcard') {
      gift.title = this.locationService.translate('Greeting card', 'Открытка')
      gift.front = this.locationService.translate('../../assets/greetingcard/front/1.png', '../../assets/greetingcard/front/21.png')
      gift.back = '../../assets/greetingcard/back/5.jpg'
      gift.text = this.locationService.translate('May you be gifted with life’s\nbiggest joys and never-ending bliss.\nAfter all, you yourself are a gift to earth, so you deserve the best.\nHappy birthday.', 'Желаю счастья, радости, любви,\nЕще мечты заветной исполненья,\nЗдоровья крепкого, удач всегда во всем\nИ добрых слов не только в день рожденья!')
      gift.sign = []
      gift.color = '#ffffff'
    } else if (t === 'game') {
      gift.title = this.locationService.translate('Game', 'Игра')
      gift.color = '#003791'
      gift.front = '../../assets/game/example.jpg'
      gift.inside = '../../assets/game/game.png'
      gift.side = '../../assets/game/gameleft.png'
      gift.code = 'WERB-NBHP-DXCV-ZZKL-UIFM'
      gift.platform = 'ps'
      gift.open = false
    } else if (t === 'speaker') {
      gift.title = this.locationService.translate('Audio', 'Аудиозапись')
      gift.grill = '../../assets/speaker/grill/0.png'
      gift.color = "#ff5722"
      gift.value = []
    } else if (t === 'tablet') {
      gift.title = this.locationService.translate('Audio', 'Видеозапись')
      gift.color = "#c0c0c0"
      gift.value = ''
    } else if (t === 'photo') {
      gift.title = this.locationService.translate('Photo', 'Фото')
      gift.photo = '../../assets/photo/example.jpg'
      gift.sign = []
    }

    gift.type = t

    this.gifts.push(gift)
  }

  setdisableds(t: Touch): void {
     if (this.stats.menu === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = false
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screensignphoto === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = false
      this.disableds.screenhowitworks = true
    } else if (this.stats.screentakephoto === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = false
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screenwatchvideo === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = false
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screenrecordvideo === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = false
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screencolorplate === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = false
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screenlistenaudio === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = false
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screenrecordaudio === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.menu = true
      this.disableds.screenrecordaudio = false
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screenplatformgame === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = false
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screensigngreeting === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.screentrim = true
      this.disableds.menu = true
      this.disableds.screensigngreeting = false
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screenlisttrim === 'open') {
        this.disableds.giftslist = true
        this.disableds.screenadd = true
        this.disableds.screenviewgift = true
        this.disableds.screentrim = true
        this.disableds.screensigngreeting = true
        this.disableds.screenplatformgame = true
        this.disableds.screenrecordaudio = true
        this.disableds.screencolorplate = true
        this.disableds.screenrecordvideo = true
        this.disableds.screenwatchvideo = true
        this.disableds.screentakephoto = true
        this.disableds.screensignphoto = true
        this.disableds.screenhowitworks = true
        if (t.action === 'move' && t.prev!.action === 'start') {
          if (Math.abs(t.y-t.prev!.y) > Math.abs(t.x-t.prev!.x)) {
            this.disableds.screenlisttrim = false
            this.disableds.menu = true
          } else {
            if (t.x-t.prev!.x < 0) {
              this.disableds.screenlisttrim = true
              this.disableds.menu = false
            } else {
              this.disableds.screenlisttrim = false
              this.disableds.menu = true
            }
          }
        }
    } else if (this.stats.screentrim === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.screenlisttrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
      if (this.modetrim === 'usual') {
        if (t.action === 'move' && t.prev!.action === 'start') {
          if (t.x-t.prev!.x < 0) {
            this.disableds.menu = false
            this.disableds.screentrim = true
          } else {
            this.disableds.menu = true
            this.disableds.screentrim = false
          }
        }
      } else {
        this.disableds.menu = true
        this.disableds.screentrim = false
      }
    } else if (this.stats.screenadd === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = false
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screenlisttrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
    } else if (this.stats.screenviewgift === 'open') {
      this.disableds.screenlisttrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
      if (this.modeviewgift === 'review') {
        this.disableds.giftslist = true
        this.disableds.screenadd = true
        this.disableds.screenviewgift = false
        this.disableds.menu = true
        this.disableds.screentrim = true
      } else {
        if (t.action === 'move' && t.prev !== null && t.prev.action === 'start') {
          const delta: Array<number> = [t.x-t.prev!.x, t.y-t.prev!.y]
          if (Math.abs(delta[1]) > Math.abs(delta[0])) {
            this.disableds.giftslist = true
            this.disableds.screenadd = true
            this.disableds.screenviewgift = false
            this.disableds.menu = true
            this.disableds.screentrim = true
          } else {
            if (delta[0] < 0) {
              this.disableds.giftslist = true
              this.disableds.screenadd = true
              this.disableds.screenviewgift = true
              this.disableds.menu = false
              this.disableds.screentrim = true
            } else {
              this.disableds.giftslist = true
              this.disableds.screenadd = true
              this.disableds.screenviewgift = false
              this.disableds.menu = true
              this.disableds.screentrim = true
            }
          }
        }
      }
    } else if (this.stats.screenhowitworks === 'open') {
      this.disableds.giftslist = true
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.menu = true
      this.disableds.screentrim = true
      this.disableds.screenlisttrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = false
    } else {
      this.disableds.screenadd = true
      this.disableds.screenviewgift = true
      this.disableds.screenlisttrim = true
      this.disableds.screensigngreeting = true
      this.disableds.screenplatformgame = true
      this.disableds.screenrecordaudio = true
      this.disableds.screenlistenaudio = true
      this.disableds.screencolorplate = true
      this.disableds.screenrecordvideo = true
      this.disableds.screenwatchvideo = true
      this.disableds.screentakephoto = true
      this.disableds.screensignphoto = true
      this.disableds.screenhowitworks = true
      this.disableds.screentrim = true
      if (t.action === 'move' && t.prev !== null && t.prev.action === 'start') {
        this.disableds.giftslist = true
        this.disableds.menu = true
        if (!this.moveWithWaiting || this.gifts.length < 2) {
          const delta: Array<number> = [t.x-t.prev!.x, t.y-t.prev!.y]
          if (Math.abs(delta[1]) > Math.abs(delta[0])) {
            this.disableds.giftslist = false
            this.disableds.menu = true
          } else {
            this.disableds.giftslist = true
            if (delta[0] > 0) {
              this.disableds.menu = true
            } else if (delta[0] < 0) {
              this.disableds.menu = false
            }
          }
        } else {
          this.optionListGiftAnimated = true
        }
      }
    }
  }

  dropListGifts(event: CdkDragDrop<string[]>) {
    let g = this.gifts[event.previousIndex]
    this.gifts.splice(event.previousIndex, 1)
    this.gifts.splice(event.currentIndex, 0, g)
  }

  closesignturegreeting(): void {
    this.menusublimeshow = !this.menusublimeshow

    if (this.activeGift.type === 'photo') {
      this.activesignphoto = false
    }
  }

  chooseaddlist(type: string): void {
    this.addgifttolist(type)
    this.stats.screenadd = 'close'
    this.setmenuhome()
  }

  changecolor(e: any) {
    if (this.activeGift.type === 'greetingcard') {
      if (this.stats.screensigngreeting === 'open') {
        this.signgreetingcolor = e.target.value
      } else {
        this.activeGift.color = e.target.value
      }
    } else if (this.activeGift.type === 'game') {
      this.activeGift.color = e.target.value
      this.refreshsnapshots = !this.refreshsnapshots
    } else if (this.activeGift.type === 'speaker') {
      this.activeGift.color = e.target.value
      this.refreshsnapshots = !this.refreshsnapshots
    } else if (this.activeGift.type === 'photo') {
      this.signgreetingcolor = e.target.value
    }
  }

  menuwaschoosen(val: string): void {
    if (val === 'add') {
      this.menu = []
      this.stats.screenadd = 'open'
    } else if (val === 'howitworks') {
      if (this.activeGift) {
        this.stats.screenviewgift = 'close'
        this.stats.screenhowitworks = 'open'
      }
    } else if (val === 'delete') {
      this.confirm.value = this.locationService.translate('Are you sure?', 'Вы уверены?')
      this.confirm.type = 'deleteGift'
    } else if (val === 'code') {
      if (this.activeGift?.type === 'game') {
        this.renamewhat = 'gamecode'
        this.renamevalue = this.activeGift.code
        this.enterablerename = false
        this.stats.screenviewgift = 'close'
        this.stats.screentitle = 'open'
      }
    } else if (val === 'photo') {
      if (this.activeGift.type === 'photo') {
        this.stats.screenviewgift = 'close'
        this.stats.screentakephoto = 'open'
        this.activetakephoto = true
        this.menu = []
      }
    } else if (val === 'watch') {
      if (this.activeGift.type === 'tablet') {
        this.stats.screenviewgift = 'close'
        this.stats.screenwatchvideo = 'open'
        this.activewatchvideo = true
      }
    } else if (val === 'case') {
      if (this.activeGift.type === 'tablet') {
        this.stats.screenviewgift = 'close'
        this.stats.screencolorplate = 'open'
        this.sublimerefreshcolorplate = !this.sublimerefreshcolorplate
      }
    } else if (val === 'listen') {
      if (this.activeGift.type === 'speaker') {
        this.stats.screenviewgift = 'close'
        this.stats.screenlistenaudio = 'open'
      }
    } else if (val === 'record') {
      if (this.activeGift.type === 'speaker') {
        this.stats.screenviewgift = 'close'
        this.stats.screenrecordaudio = 'open'
        this.menu = []
      } else if (this.activeGift.type === 'tablet') {
        this.stats.screenviewgift = 'close'
        this.stats.screenrecordvideo = 'open'
        this.initrecordvideo = true
        this.menu = []
      }
    } else if (val === 'open') {
      if (this.activeGift.type === 'game') {
        this.activeGift.open = true
        this.setmenuviewgift()
      }
    } else if (val === 'close') {
      if (this.activeGift.type === 'game') {
        this.activeGift.open = false
        this.setmenuviewgift()
      }
    } else if (val === 'eraser') {
      if (this.stats.screensigngreeting === 'open' || this.stats.screensignphoto === 'open') {
        this.signgreetingtool = 'eraser'
        this.menu = [
          {
            title: this.locationService.translate('pen', 'ручка'),
            ico: '../../assets/pen.svg',
            value: 'pen'
          }, {
            title: this.locationService.translate('cancel', 'отменить'),
            ico: '../../assets/cross.svg',
            value: 'cancel'
          }, {
            title: this.locationService.translate('save', 'сохранить'),
            ico: '../../assets/checkmark.svg',
            value: 'save'
          }
        ]
      }
    } else if (val === 'pen') {
      if (this.stats.screensigngreeting === 'open' || this.stats.screensignphoto === 'open') {
        this.signgreetingtool = 'pen'
        this.menu = [
          {
            title: this.locationService.translate('eraser', 'ластик'),
            ico: '../../assets/eraser.svg',
            value: 'eraser'
          }, {
            title: this.locationService.translate('color', 'цвет'),
            ico: '../../assets/palette.svg',
            value: 'color'
          }, {
            title: this.locationService.translate('cancel', 'отменить'),
            ico: '../../assets/cross.svg',
            value: 'cancel'
          }, {
            title: this.locationService.translate('save', 'сохранить'),
            ico: '../../assets/checkmark.svg',
            value: 'save'
          }
        ]
      }
    } else if (val === 'sign') {
      if (this.activeGift.type === 'greetingcard') {
        this.stats.screenviewgift = 'close'
        this.stats.screensigngreeting = 'open'
        this.signgreetingcolor = "#ffffff"
        this.menu = [
          {
            title: this.locationService.translate('eraser', 'ластик'),
            ico: '../../assets/eraser.svg',
            value: 'eraser'
          }, {
            title: this.locationService.translate('color', 'цвет'),
            ico: '../../assets/palette.svg',
            value: 'color'
          }, {
            title: this.locationService.translate('cancel', 'отменить'),
            ico: '../../assets/cross.svg',
            value: 'cancel'
          }, {
            title: this.locationService.translate('save', 'сохранить'),
            ico: '../../assets/checkmark.svg',
            value: 'save'
          }
        ]
      } else if (this.activeGift.type === 'photo') {
        this.stats.screenviewgift = 'close'
        this.stats.screensignphoto = 'open'
        this.activesignphoto = true
        this.signgreetingcolor = "#000000"
        this.menu = [
          {
            title: this.locationService.translate('eraser', 'ластик'),
            ico: '../../assets/eraser.svg',
            value: 'eraser'
          }, {
            title: this.locationService.translate('color', 'цвет'),
            ico: '../../assets/palette.svg',
            value: 'color'
          }, {
            title: this.locationService.translate('cancel', 'отменить'),
            ico: '../../assets/cross.svg',
            value: 'cancel'
          }, {
            title: this.locationService.translate('save', 'сохранить'),
            ico: '../../assets/checkmark.svg',
            value: 'save'
          }
        ]
      }
    } else if (val === 'chgtitle') {
      this.menu = []
      this.stats.screenviewgift = 'close'
      this.stats.screentitle = 'open'
      this.renamewhat = 'title'
      setTimeout(() => {
        this.renamemin = 3
        this.renamemax = 100
        this.renamevalue = this.activeGift.title
        this.enterablerename = false
      }, 10)
    } else if (val === 'color') {
      if (this.activeGift.type === 'greetingcard') {
        if (this.stats.screensigngreeting === 'open') {
          this.host.nativeElement.querySelector("#inputcolor").value = this.signgreetingcolor
        } else {
          this.host.nativeElement.querySelector("#inputcolor").value = this.activeGift.color
        }
        this.host.nativeElement.querySelector("#inputcolor").click()
      } else if (this.activeGift.type === 'game') {
        this.host.nativeElement.querySelector("#inputcolor").value = this.activeGift.color
        this.host.nativeElement.querySelector("#inputcolor").click()
      } else if (this.activeGift.type === 'speaker') {
        this.host.nativeElement.querySelector("#inputcolor").value = this.activeGift.color
        this.host.nativeElement.querySelector("#inputcolor").click()
      } else if (this.activeGift.type === 'photo') {
        this.host.nativeElement.querySelector("#inputcolor").value = this.signgreetingcolor
        this.host.nativeElement.querySelector("#inputcolor").click()
      }
    } else if (val === 'text') {
      if (this.activeGift.type === 'greetingcard') {
        this.menu = []
        this.stats.screenviewgift = 'close'
        this.stats.screentitle = 'open'
        this.renamewhat = 'greetingcardtext'
        this.renamemin = 10
        this.renamemax = 200
        this.enterablerename = true
        setTimeout(() => {
          this.renamevalue = this.activeGift.text
        }, 200)
      }
    } else if (val === 'grill') {
      if (this.activeGift.type === 'speaker') {
        this.stats.screenviewgift = 'close'
        this.stats.screentrim = 'open'
        this.imgtrim = this.activeGift.grill
        this.ratiotrim = 1/1
        this.listtrim = 'speakergrill'
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('change', 'изменить'),
          ico: '../../assets/image.svg',
          value: 'chgimage'
        }]
      }
    } else if (val === 'front') {
      if (this.activeGift.type === 'greetingcard') {
        this.stats.screenviewgift = 'close'
        this.stats.screentrim = 'open'
        this.imgtrim = this.activeGift.front
        this.ratiotrim = 297/420
        this.listtrim = 'greetingcardfront'
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('change', 'изменить'),
          ico: '../../assets/image.svg',
          value: 'chgimage'
        }]
      } else if (this.activeGift.type === 'game') {
        this.stats.screenviewgift = 'close'
        this.stats.screentrim = 'open'
        this.imgtrim = this.activeGift.front
        this.ratiotrim = 256/310
        this.listtrim = 'gamefront'
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('upload', 'загрузить'),
          ico: '../../assets/upload-mini.svg',
          value: 'uploadimage'
        }]
      }
    } else if (val === 'inside') {
      if (this.activeGift.type === 'game') {
        this.stats.screenviewgift = 'close'
        this.stats.screentrim = 'open'
        this.imgtrim = this.activeGift.inside
        this.ratiotrim = 1/1
        this.listtrim = 'gameinside'
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('upload', 'загрузить'),
          ico: '../../assets/upload-mini.svg',
          value: 'uploadimage'
        }]
      }
    }  else if (val === 'side') {
      if (this.activeGift.type === 'game') {
        this.stats.screenviewgift = 'close'
        this.stats.screentrim = 'open'
        this.imgtrim = this.activeGift.side
        this.ratiotrim = 79/828
        this.listtrim = 'gameside'
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('upload', 'загрузить'),
          ico: '../../assets/upload-mini.svg',
          value: 'uploadimage'
        }]
      }
    } else if (val === 'uploadimage') {
      if (this.activeGift.type === 'game') {
        this.inputUploadImageTrim()
      }
    } else if (val === 'back') {
      if (this.activeGift.type === 'greetingcard') {
        this.stats.screenviewgift = 'close'
        this.stats.screentrim = 'open'
        this.imgtrim = this.activeGift.back
        this.ratiotrim = 1/1
        this.listtrim = 'greetingcardback'
      }
      this.menu = [{
        title: this.locationService.translate('trim', 'обрезать'),
        ico: '../../assets/scissors.svg',
        value: 'trim'
      }, {
        title: this.locationService.translate('change image', 'изменить картинку'),
        ico: '../../assets/image.svg',
        value: 'chgimage'
      }]
    } else if (val === 'trim') {
      this.modetrim = 'trim'
      this.menu = [{
        title: this.locationService.translate('save', 'сохранить'),
        ico: '../../assets/checkmark.svg',
        value: 'save'
      }, {
        title: this.locationService.translate('cancel', 'отменить'),
        ico: '../../assets/cross.svg',
        value: 'cancel'
      }]
    } else if (val === 'save') {
      if (this.stats.screentrim === 'open') {
        if (this.hashedtrim !== null) this.hashedtrim = null;
        this.sublimesavetrim = !this.sublimesavetrim
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('change image', 'изменить картинку'),
          ico: '../../assets/image.svg',
          value: 'chgimage'
        }]
      } else if (this.stats.screensigngreeting === 'open') {
        this.stats.screensigngreeting = 'close'
        this.stats.screenviewgift = 'open'
        this.signgreetingsublimesave = !this.signgreetingsublimesave
        this.signgreetingtool = 'pen'
        this.setmenuviewgift()
      } else if (this.stats.screensignphoto === 'open') {
        this.stats.screensignphoto = 'close'
        this.stats.screenviewgift = 'open'
        this.signphotosublimesave = !this.signphotosublimesave
        this.signgreetingtool = 'pen'
        this.setmenuviewgift()
      }
    } else if (val === 'cancel') {
      if (this.stats.screentrim === 'open') {
        if (this.hashedtrim !== null) {
          this.imgtrim = this.hashedtrim
          this.hashedtrim = null
        }
        this.modetrim = 'usual'
        this.menu = [{
          title: this.locationService.translate('trim', 'обрезать'),
          ico: '../../assets/scissors.svg',
          value: 'trim'
        }, {
          title: this.locationService.translate('change image', 'изменить картинку'),
          ico: '../../assets/image.svg',
          value: 'chgimage'
        }]
      } else if (this.stats.screensigngreeting === 'open') {
        this.signgreetingsublimereset = !this.signgreetingsublimereset
        this.stats.screensigngreeting = 'close'
        this.stats.screenviewgift = 'open'
        this.signgreetingtool = 'pen'
        this.setmenuviewgift()
      } else if (this.stats.screensignphoto === 'open') {
        this.signphotosublimereset = !this.signphotosublimereset
        this.stats.screensignphoto = 'close'
        this.stats.screenviewgift = 'open'
        this.signgreetingtool = 'pen'
        this.setmenuviewgift()
      }
    } else if (val === 'chgimage') {
      if (this.stats.screentrim === 'open') {
        this.stats.screentrim = 'close'
        this.stats.screenlisttrim = 'open'
        this.menu = []
      }
    } else if (val === 'platform') {
      if (this.activeGift.type === 'game') {
        this.stats.screenviewgift = 'close'
        this.stats.screenplatformgame = 'open'
        this.sublimerefreshplatform = !this.sublimerefreshplatform
        this.menu = []
      }
    }
  }

  closescreenadd(): void {
    this.stats.screenadd = 'close'
    this.setmenuhome()
  }

  showviewgift(gift: any): void {
    this.activeGift = gift
    this.stats.screenviewgift = 'open'
    this.sublimerefreshviewgift = !this.sublimerefreshviewgift
    this.setmenuviewgift()
  }

  closescreenviewgift(): void {
    if (this.stats.screentitle === 'open' || this.stats.screentrim === 'open' || this.stats.screenlisttrim === 'open' || this.stats.screensigngreeting === 'open' || this.stats.screenplatformgame === 'open' || this.stats.screenrecordaudio === 'open' || this.stats.screenlistenaudio === 'open' || this.stats.screencolorplate === 'open' || this.stats.screenrecordvideo === 'open' || this.stats.screenwatchvideo === 'open' || this.stats.screentakephoto === 'open' || this.stats.screensignphoto === 'open' || this.stats.screenhowitworks === 'open') return
    this.activeGift = null
    this.stats.screenviewgift = 'close'
    this.modeviewgift = 'usual'
    this.setmenuhome()
  }

  closehowitworks(): void {
    this.stats.screenviewgift = 'open'
    this.stats.screenhowitworks = 'close'
    this.setmenuviewgift()
  }

  closescreenrecordaudio(): void {
    this.stats.screenviewgift = 'open'
    this.stats.screenrecordaudio = 'close'
    this.sublimestoprecordaudio = !this.sublimestoprecordaudio
    this.setmenuviewgift()
  }

  closescreencolorplate(): void {
    this.stats.screencolorplate = 'close'
    this.stats.screenviewgift = 'open'
    this.setmenuviewgift()
  }

  closescreentrim(): void {
    this.stats.screentrim = 'close'
    if (this.stats.screenlisttrim === 'close') {
      this.listtrim = ''
      this.stats.screenviewgift = 'open'
      this.setmenuviewgift()
    }
  }

  closescreentrimlist(): void {
    this.stats.screenlisttrim = 'close'
    this.stats.screentrim = 'open'
    this.menu = [{
      title: 'trim',
      ico: '../../assets/scissors.svg',
      value: 'trim'
    }, {
      title: 'change',
      ico: '../../assets/image.svg',
      value: 'chgimage'
    }]
  }

  saveaudio(chunks: Array<any>): void {
    this.activeGift.value = chunks
    if (this.stats.screenviewgift === 'open') this.setmenuviewgift()
  }

  setmenuviewgift(): void {
    if (this.activeGift === null && this.stats.screenviewgift === 'close') return

    let menu = [
      {
        title: this.locationService.translate('title', 'название'),
        ico: '../../assets/rename.svg',
        value: 'chgtitle'
      },{
        title: this.locationService.translate('how it works', 'как это работает'),
        ico: '../../assets/question-mark.svg',
        value: 'howitworks'
      }
    ]
    if (this.activeGift.type === 'greetingcard') {
      menu.push({
        title: this.locationService.translate('front', 'обложка'),
        ico: '../../assets/front.svg',
        value: 'front'
      })
      menu.push({
        title: this.locationService.translate('back', 'задняя сторона'),
        ico: '../../assets/background.svg',
        value: 'back'
      })
      menu.push({
        title: this.locationService.translate('text', 'стихотворение'),
        ico: '../../assets/text.svg',
        value: 'text'
      })
      menu.push({
        title: this.locationService.translate('color', 'цвет'),
        ico: '../../assets/palette.svg',
        value: 'color'
      })
      menu.push({
        title: this.locationService.translate('signature', 'подпись'),
        ico: '../../assets/signature.svg',
        value: 'sign'
      })
    } else if (this.activeGift.type === 'game') {
      if (this.activeGift.open) {
        menu.push({
          title: this.locationService.translate('close', 'закрыть'),
          ico: '../../assets/open.svg',
          value: 'close'
        })
      } else {
        menu.push({
          title: this.locationService.translate('open', 'открыть'),
          ico: '../../assets/open.svg',
          value: 'open'
        })
      }
      menu.push({
        title: this.locationService.translate('redeem key', 'активационный ключ'),
        ico: '../../assets/password.svg',
        value: 'code'
      })
      menu.push({
        title: this.locationService.translate('platform', 'платформа'),
        ico: '../../assets/controller.svg',
        value: 'platform'
      })
      menu.push({
        title: this.locationService.translate('front', 'обложка'),
        ico: '../../assets/front.svg',
        value: 'front'
      })
      if (this.activeGift.platform === 'custom') {
        menu.push({
          title: this.locationService.translate('color', 'цвет'),
          ico: '../../assets/palette.svg',
          value: 'color'
        })
        menu.push({
          title: this.locationService.translate('inside', 'внутренняя обёртка'),
          ico: '../../assets/inside.svg',
          value: 'inside'
        })
        menu.push({
          title: this.locationService.translate('left side', 'боковая надпись'),
          ico: '../../assets/left-side.svg',
          value: 'side'
        })
      }
    } else if (this.activeGift.type === 'speaker') {
      menu.push({
        title: this.locationService.translate('record', 'запись'),
        ico: '../../assets/microphone.svg',
        value: 'record'
      })
      if (this.activeGift.value[0]) {
        menu.push({
          title: this.locationService.translate('listen', 'прослушать'),
          ico: '../../assets/speaker.svg',
          value: 'listen'
        })
      }
      menu.push({
        title: this.locationService.translate('grill', 'сетка'),
        ico: '../../assets/grill.svg',
        value: 'grill'
      })
      menu.push({
        title: this.locationService.translate('color', 'цвет'),
        ico: '../../assets/palette.svg',
        value: 'color'
      })
    } else if (this.activeGift.type === 'tablet') {
      menu.push({
        title: this.locationService.translate('case', 'корпус'),
        ico: '../../assets/case.svg',
        value: 'case'
      })
      menu.push({
        title: this.locationService.translate('record', 'запись'),
        ico: '../../assets/webcam.svg',
        value: 'record'
      })
      if (this.activeGift.value !== null && this.activeGift.value !== '') {
        menu.push({
          title: this.locationService.translate('watch', 'просмотр'),
          ico: '../../assets/eye.svg',
          value: 'watch'
        })
      }
    } else if (this.activeGift.type === 'photo') {
      menu.push({
        title: this.locationService.translate('photo', 'фото'),
        ico: '../../assets/photo.svg',
        value: 'photo'
      })
      menu.push({
        title: this.locationService.translate('sign', 'подпись'),
        ico: '../../assets/signature.svg',
        value: 'sign'
      })
    }
    menu.push({
      title: this.locationService.translate('delete gift', 'удалить'),
      ico: '../../assets/trash.svg',
      value: 'delete'
    })
    this.menu = menu
  }

  setmenuhome(): void {
    let menu = [{
      title: this.locationService.translate('add', 'добавить'),
      ico: '../../assets/plus.svg',
      value: 'add'
    }]
    if (this.gifts.length) {
      menu.push({
        title: this.locationService.translate('next stage', 'следующий этап'),
        ico: '../../assets/checkmark.svg',
        value: 'accept'
      })
    }
    this.menu = menu
  }

  screentitlewasclosed(): void {
    if (this.stats.screentitle === 'close') return
    this.setmenuviewgift()
    this.stats.screentitle = 'close'
    this.stats.screenviewgift = 'open'
  }

  screentitlewassaved(value: string): void {
    if (this.renamewhat === 'title') {
      this.activeGift.title = value
    } else if (this.renamewhat === 'greetingcardtext') {
      this.activeGift.text = value
    } else if (this.renamewhat === 'gamecode') {
      this.activeGift.code = value
    }
  }

  closetrim(): void {
    this.menusublimeshow = !this.menusublimeshow
  }
  savetrim(img: string): void {
    this.imgtrim = img
    this.modetrim = 'usual'

    if (this.listtrim === 'greetingcardfront') {
      this.activeGift.front = img
    } else if (this.listtrim === 'greetingcardback') {
      this.activeGift.back = img
    } else if (this.listtrim === 'gamefront') {
      this.activeGift.front = img
    } else if (this.listtrim === 'gameinside') {
      this.activeGift.inside = img
    } else if (this.listtrim === 'gameside') {
      this.activeGift.side = img
    } else if (this.listtrim === 'speakergrill') {
      this.activeGift.grill = img
    }

    this.refreshsnapshots = !this.refreshsnapshots
  }

  async uploadImageTrim(img: string): Promise<void> {
    this.hashedtrim = this.imgtrim
    this.imgtrim = img
    this.stats.screenlisttrim = 'close'
    this.stats.screentrim = 'open'
    await this.asyncservice.delay(300)
    this.modetrim = 'trim'
    this.menu = [{
      title: this.locationService.translate('save', 'сохранить'),
      ico: '../../assets/checkmark.svg',
      value: 'save'
    }, {
      title: this.locationService.translate('cancel', 'отменить'),
      ico: '../../assets/cross.svg',
      value: 'cancel'
    }]
    return new Promise(res => res())
  }

  inputUploadImageTrim(): void {
    this.host.nativeElement.querySelector("#inputuploadtrim").click()
  }

  async tryuploadimage(e: any): Promise<void> {
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
      this.uploadImageTrim(img.src)
    } else {
      this.showerror(error.join('; '))
      e.target.value = null
    }

    return new Promise(res => res())
  }

  async showerror(err: string): Promise<void> {
    clearTimeout(this.timeoutError)
    this.valerror = ''
    await this.asyncservice.delay(250)
    this.valerror = err
    this.timeoutError = setTimeout(() => {
      this.valerror = ''
    }, 5000)
    return new Promise(res => res())
  }

  savegreetingsign(points: Array<any>): void {
    this.activeGift.sign = [...points]
    this.sublimerefreshviewgift = !this.sublimerefreshviewgift
  }

  setPlatformGame(platform: string): void {
    this.activeGift.platform = platform
    this.stats.screenplatformgame = 'close'
    this.stats.screenviewgift = 'open'
    if (platform === 'pc') {
      this.activeGift.color = "#000000"
      this.activeGift.inside = "../../assets/game/game.png"
      this.activeGift.side = "../../assets/game/gameleft.png"
    } else if (platform === 'ps') {
      this.activeGift.color = "#003791"
      this.activeGift.inside = "../../assets/game/ps.png"
      this.activeGift.side = "../../assets/game/psleft.png"
    } else if (platform === 'xbox') {
      this.activeGift.color = "#107C10"
      this.activeGift.inside = "../../assets/game/xbox.png"
      this.activeGift.side = "../../assets/game/xboxleft.png"
    } else if (platform === 'switch') {
      this.activeGift.color = "#e60012"
      this.activeGift.inside = "../../assets/game/switch.png"
      this.activeGift.side = "../../assets/game/switchleft.png"
    } if (platform === 'custom') {
      this.activeGift.color = "#000000"
      this.activeGift.inside = "../../assets/game/game.png"
      this.activeGift.side = "../../assets/game/gameleft.png"
    }
    this.refreshsnapshots = !this.refreshsnapshots
    this.setmenuviewgift()
  }

  setColorTablet(color: string) {
    this.activeGift.color = color
    this.closescreencolorplate()
  }

  screenplatformgamewasclose(): void {
    this.stats.screenplatformgame = 'close'
    this.stats.screenviewgift = 'open'
    this.setmenuviewgift()
  }

  closescreenlistenaudio(): void {
    this.stats.screenlistenaudio = 'close'
    this.stats.screenviewgift = 'open'
  }

  closerecordvideo(): void {
    this.stats.screenrecordvideo = 'close'
    this.stats.screenviewgift = 'open'
    this.initrecordvideo = false
    this.setmenuviewgift()
  }

  saverecordvideo(video: any): void {
    this.activeGift.value = URL.createObjectURL(video[0])
  }

  closewatchvideo(): void {
    this.stats.screenwatchvideo = 'close'
    this.stats.screenviewgift = 'open'
    this.activewatchvideo = false
  }

  closetakephoto(): void {
    this.stats.screentakephoto = 'close'
    this.stats.screenviewgift = 'open'
    this.activetakephoto = false
    this.setmenuviewgift()
  }

  savephoto(photo: string): void {
    this.activeGift.photo = photo
    this.refreshsnapshots = !this.refreshsnapshots
  }

  closesignphoto(): void {
    if (this.activesignphoto) this.activesignphoto = false
  }

  actionmenu(act: string): void {
    this.stats.menu = act

    if (act === 'close') {
      if (this.stats.screensignphoto === 'open') {
        this.activesignphoto = true
      }
    }
  }

  deleteGift(id: number): void {
    for (let i = 0; i < this.gifts.length; i++) {
      if (this.gifts[i].id === id) {
        this.gifts.splice(i, 1)
        break
      }
    }
  }

  resultConfirm(res: any) {
    if (res === 'agree' && this.confirm.type === 'deleteGift') {
      this.deleteGift(this.activeGift.id)
      this.stats.screenviewgift = 'close'
    }

    this.confirm.value = ''
    this.confirm.type = ''
  }

  ngOnInit(): void {
    this.subs.push(
      this.touchservice.stream$.subscribe((e: Touch) => { this.processtouch(e) })
    )

    this.subs.push(
      this.route.queryParams.subscribe((params: Params) => {
        const country = params['l']
        if (country !== 'us' && country !== 'ru') {
          this.showSelectLanguage = true
        } else {
          this.showSelectLanguage = false
        }
        this.menu = [
          {
            title: this.locationService.translate('add', 'добавить'),
            ico: '../../assets/plus.svg',
            value: 'add'
          }
        ]
      })
    )


    // let svg = this.linersvgservice.getSvg(100, 100, [ ['#000', [5, 5], [5, 10], [16, 28]], ['#cc0000', [80, 50], [55, 40], [90, 90]] ])
    // this.host.nativeElement.appendChild(svg)
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
  }

}

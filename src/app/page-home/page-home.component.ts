import { Component, OnInit } from '@angular/core'
import { LocationService } from '../services/location.service'
import { Router } from '@angular/router'
import { IsTouchService } from '../services/is-touch.service'

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {

  typeScreen: string = 'none'

  box: any = {
    animate: false,
    packed: true,
    wrapped: true,
    tapped: true,
    package: '../../assets/box/package/4.jpg',
    tape: '../../assets/box/tape/1.jpg',
    coord: { x: 0, y: 0, z: 0 },
    rotate: { x: -15, y: 110, z: 0 },
    size: { w: 200, h: 130, d: 200 },
    scale: 1,
    shiftRotate: { x: 0, y: 0 }
  }

  listCelebrates: Array<any> = [
    { 
      key: 'new_year_first',
      title: this.locationService.translate('new year holidays', 'новый год'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-01-01T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-01-06T23:59:59`)
      }
    },
    { 
      key: 'christmas',
      title: this.locationService.translate('birthday of Jesus', 'день рождения Иисуса'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-01-07T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-01-07T23:59:59`)
      }
    },
    { 
      key: 'defender',
      title: this.locationService.translate('defender of the fatherland day', '23 февраля'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-02-23T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-02-23T23:59:59`)
      }
    },
    { 
      key: 'eight_march',
      title: this.locationService.translate('international women\'s day', '8 марта'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-03-08T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-03-08T23:59:59`)
      }
    },
    { 
      key: 'april_fool',
      title: this.locationService.translate('april fool', 'день дурака'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-04-01T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-04-01T23:59:59`)
      }
    },
    { 
      key: 'alexander_2',
      title: this.locationService.translate('birthday of Alexander 2', 'день рождения Александра 2'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-29-01T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-29-01T23:59:59`)
      }
    },
    { 
      key: 'first_may',
      title: this.locationService.translate('may day', 'первое мая'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-05-01T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-05-01T23:59:59`)
      }
    },
    { 
      key: 'victory_day',
      title: this.locationService.translate('victory day', 'день победы'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-05-09T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-05-09T23:59:59`)
      }
    },
    { 
      key: 'pushkin',
      title: this.locationService.translate('birthday of Pushkin', 'день рождения Пушкина'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-06-06T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-06-06T23:59:59`)
      }
    },
    { 
      key: 'gaius',
      title: this.locationService.translate('birthday of Gaius Julius Caesar', 'день рождения Гая Юлия Цезаря'),
      dates: {
        date1: new Date(`${new Date().getFullYear()}-07-09T00:00:00`),
        date2: new Date(`${new Date().getFullYear()}-07-09T23:59:59`)
      }
    },
    { 
      key: 'new_year_second',
      title: this.locationService.translate('new year holidays', 'новый год'),
      dates: {
        date1: new Date(`${new Date().getFullYear()+1}-01-01T00:00:00`),
        date2: new Date(`${new Date().getFullYear()+1}-01-06T23:59:59`)
      }
    },
  ]

  constructor(
    public locationService: LocationService,
    public router: Router,
    private isTouch: IsTouchService
  ) { }

  setTypeScreen(): void {
    if (this.isTouch.get()) {
      this.typeScreen = 'touch'
    } else {
      this.typeScreen = 'desktop'
    }
  }

  getCelebrates(): Array<string> {
    const daysPerCelebrate = 10

    const now = new Date() // '2024-04-01T12:12:12'

    const thorugh = this.locationService.translate('soon', 'скоро')

    let answer: Array<string> = []

    this.listCelebrates.forEach((option: any) => {
      if (option.dates.date1.getTime()-now.getTime() < daysPerCelebrate*24*60*60*1000 && option.dates.date1.getTime()-now.getTime() > 0) {
        const days = Math.ceil((option.dates.date1.getTime()-now.getTime())/(24*60*60*1000))
        answer.push(`${option.title} ${this.locationService.translate('in', 'через')} ${days} ${this.locationService.translate('d.', 'д.')}`)
      } else if (now.getTime() > option.dates.date1.getTime() && now.getTime() < option.dates.date2.getTime()) {
        answer.push(`${option.title} ${this.locationService.translate('is already here!!!', 'уже идёт!!!')}`)
      }
    })

    return answer
  }

  getRandomIntInclusive(min: number, max: number): number {
    return Math.floor(Math.random()*(Math.floor(max)-Math.ceil(min)+1)+Math.ceil(min))
  }

  setBox(): void {
    this.box.package = `../../assets/box/package/${this.getRandomIntInclusive(1, 20)}.jpg`
    this.box.tape = `../../assets/box/tape/${this.getRandomIntInclusive(1, 20)}.jpg`
  }

  goToLink(link: string): void {
    this.router.navigateByUrl(link)
  }

  ngOnInit(): void {
    this.setTypeScreen()
    this.setBox()
  }

}

import { Injectable, isDevMode } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Subscription } from 'rxjs'
// import { BACKEND_BASE } from '@environments/environment'

interface Response {
  success: boolean;
  error: string;
  result: any;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  BACKEND_BASE: string = isDevMode() ? 'http://localhost:2000' : 'https://tebe.864355-totarget12.tmweb.ru:2000'
  httpOptions = { headers: new HttpHeaders({ 'Content-type': 'application/json' }) }

  files: Array<any> = []
  box: any = {}
  gifts: Array<any> = []
  code: string = ''

  constructor(
    private httpClient: HttpClient
  ) { }

  getLinkFromBackend(link: string): string {
    if (/^\.\.\/\.\.\/.*/g.test(link)) {
      return link
    } else {
      return `${this.BACKEND_BASE}/${link}`
    }
  }

  isBase64(str: string): boolean {
    str = str.split(',').pop() || ''

    if (str === '' || str.trim() === '') return false
    try {
      return btoa(atob(str)) == str
    } catch (err) {
      return false
    }
  }

  generateIdFile(): number {
    let max = 0
    this.files.forEach((f: any) => {
      if (f.idFront > max) {
        max = f.idFront
      }
    })

    return max+1
  }

  getStringFile(stringFile: any): number | string {

    if (this.isBase64(stringFile)) {
      const mimeType = stringFile.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
      const extension = stringFile.match(/[^:/]\w+(?=;|,)/)[0]
      const idFront = this.generateIdFile()

      this.files.push({
        mimeType,
        extension,
        idFront,
        idBack: null,
        link: null,
        value: stringFile
      })

      return idFront
    } else {
      return stringFile
    }
  }

  setBox(box: any): boolean {
    try {
      this.box = {
        link: box.link,
        package: this.getStringFile(box.package),
        tape: this.getStringFile(box.tape),
        costPrice: box.costPrice,
        costType: box.costType,
        costRate: box.costRate,
        costCurrency: box.costCurrency
      }
      return true
    } catch (err) {
      return false
    }
  }

  setGifts(gifts: Array<any>): boolean {
    this.gifts = []

    try {
      gifts.forEach(g => {
        
        let gift: any = {
            idFront: g.id,
            title: g.title,
            type: g.type,
            cell: { ...g.cell },
        }

        if (g.type === 'greetingcard') {
          gift = {
            ...gift,
            color: g.color,
            front: this.getStringFile(g.front),
            back: this.getStringFile(g.back),
            sign: JSON.parse(JSON.stringify(g.sign)),
            text: g.text
          }
        } else if (g.type === 'game') {
          gift = {
            ...gift,
            color: g.color,
            code: g.code,
            front: this.getStringFile(g.front),
            inside: this.getStringFile(g.inside),
            platform: g.platform,
            side: this.getStringFile(g.side)
          }
        } else if (g.type === 'speaker') {
          gift = {
            ...gift,
            color: g.color,
            duration: g.duration || null,
            grill: this.getStringFile(g.grill),
            sounds: JSON.parse(JSON.stringify(g.sounds || [])),
            value: this.getStringFile(g.value)
          }
        } else if (g.type === 'tablet') {
          gift = {
            ...gift,
            color: g.color,
            duration: g.duration,
            value: this.getStringFile(g.value)
          }
        } else if (g.type === 'photo') {
          gift = {
            ...gift,
            photo: this.getStringFile(g.photo),
            sign: JSON.parse(JSON.stringify(g.sign))
          }
        }

        this.gifts.push(gift)
      })

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  createBox(box: any, gifts: Array<any>): Promise<any> {

    this.files = []
    this.box = {}
    this.gifts = []

    this.setBox(box)
    this.setGifts(gifts)

    // return new Promise(res => res(null))
    return new Promise(res => {
      const subscribe: Subscription = this.httpClient.post<Response>(
        `${this.BACKEND_BASE}/api/v1/createbox`,
        { files: this.files, box: this.box, gifts: this.gifts },
        this.httpOptions
      ).subscribe((response: Response) => {
        subscribe.unsubscribe()

        res(response)
      })
    })
  }

  getBoxGeneral(id: number): Promise<Response> {
    return new Promise(res => {
      const subscribe: Subscription = this.httpClient.post<Response>(
        `${this.BACKEND_BASE}/api/v1/getboxgeneral`,
        { id },
        this.httpOptions
      ).subscribe((response: Response) => {
        subscribe.unsubscribe()

        res(response)
      })
    })
  }

  getBoxGeneralByLink(link: string): Promise<Response> {
    return new Promise(res => {
      const subscribe: Subscription = this.httpClient.post<Response>(
        `${this.BACKEND_BASE}/api/v1/getboxgeneralbylink`,
        { link },
        this.httpOptions
      ).subscribe((response: Response) => {
        subscribe.unsubscribe()

        res(response)
      })
    })
  }

  getBox(id: number, code: string): Promise<Response> {
    return new Promise(res => {
      const subscribe: Subscription = this.httpClient.post<Response>(
        `${this.BACKEND_BASE}/api/v1/getbox`,
        { id, code },
        this.httpOptions
      ).subscribe((response: Response) => {
        subscribe.unsubscribe()

        res(response)
      })
    })
  }

  checkLinkBox(link: string): Promise<Response> {
    console.log(`${this.BACKEND_BASE}/api/v1/checklinkbox`)
    return new Promise(res => {
      const subscribe: Subscription = this.httpClient.post<Response>(
        `${this.BACKEND_BASE}/api/v1/checklinkbox`,
        { link },
        this.httpOptions
      ).subscribe((response: Response) => {
        subscribe.unsubscribe()

        res(response)
      })
    })
  }

  // setLinkBox(id: number, link: string): Promise<Response> {
  //   return new Promise(res => {
  //     const subscribe: Subscription = this.httpClient.post<Response>(
  //       `${this.BACKEND_BASE}/api/v1/setlinkbox`,
  //       { id, link },
  //       this.httpOptions
  //     ).subscribe((response: Response) => {
  //       subscribe.unsubscribe()

  //       res(response)
  //     })
  //   })
  // }

}

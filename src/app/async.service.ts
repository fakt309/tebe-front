import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsyncService {

  constructor() { }

  async delay(ms: number): Promise<void> {
    return new Promise(res => {
      setTimeout(() => {
        res()
      }, ms)
    })
  }

  async loadImg(url: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      let img = new Image()
      img.onload = () => res(img)
      img.onerror = (err) => rej(err)
      img.src = url
    })
  }

  async readFile(file: any): Promise<any> {
    return new Promise((res, rej) => {
      var reader = new FileReader()
      reader.onload = () => res(reader.result)
      reader.onerror  = err => rej(err)
      reader.readAsDataURL(file)
    })
  }
  
}

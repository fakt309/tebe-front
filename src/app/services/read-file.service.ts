import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {

  constructor() { }

  async getImageByUrl(url: string): Promise<any> {
    return new Promise((res: any, rej: any) => {
      let img = new Image()
      img.onload = () => { res(img) }
      img.onerror = (err: any) => { rej(err) }
      img.src = url
    })
  }

  async getImageFromFile(file: File): Promise<any> {
    return new Promise((res: any, rej: any) => {
      const reader = new FileReader()
      reader.onload = async () => {
        let img = await this.getImageByUrl(reader.result as string)
        res(img)
      }
      reader.onerror = (err: any) => { rej(err) }
      reader.readAsDataURL(file)
    })
  }

  async getBase64ByUrl (url: string): Promise<any> {
    const data = await fetch(url)
    const blob = await data.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
      }
      reader.onerror = reject
    })
  };

}

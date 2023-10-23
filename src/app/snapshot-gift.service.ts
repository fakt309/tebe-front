import { Injectable, OnInit } from '@angular/core'
import { ReadFileService } from './services/read-file.service'

@Injectable({
  providedIn: 'root'
})
export class SnapshotGiftService implements OnInit {

  constructor(
    private readfileservice: ReadFileService
  ) { }

  async get(gift: any): Promise<string> {
    const width = 500
    const height = 500
    const cnvs = document.createElement('canvas')
    cnvs.setAttribute('width', `${width}px`)
    cnvs.setAttribute('height', `${height}px`)
    const ctx = cnvs.getContext('2d')
    if (gift.type == 'greetingcard') {
      let h = height
      let w = h*(297/420)
      let front = gift.front || '../../assets/greetingcard/front/1.png'

      const img = await this.readfileservice.getImageByUrl(front)

      ctx!.drawImage(img, (width-w)/2, (height-h)/2, w, h)
    } else if (gift.type == 'game') {
      let h = height
      let w = h*(135/190)
      let radius = 0.1*w
      let color = gift.color || '#003791'
      let front = gift.front || '../../assets/game/example.jpg'

      const img = await this.readfileservice.getImageByUrl(front)

      ctx!.beginPath()
      ctx!.arc((width-w)/2+radius, (height-h)/2+radius, radius, 0, 2*Math.PI)
      ctx!.closePath()
      ctx!.fillStyle = color
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(width-(width-w)/2-radius, (height-h)/2+radius, radius, 0, 2*Math.PI)
      ctx!.closePath()
      ctx!.fillStyle = color
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc((width-w)/2+radius, height-(height-h)/2-radius, radius, 0, 2*Math.PI)
      ctx!.closePath()
      ctx!.fillStyle = color
      ctx!.fill()
      ctx!.beginPath()
      ctx!.arc(width-(width-w)/2-radius, height-(height-h)/2-radius, radius, 0, 2*Math.PI)
      ctx!.closePath()
      ctx!.fillStyle = color
      ctx!.fill()
      ctx!.beginPath()
      ctx!.rect((width-w)/2+radius, (height-h)/2, w-2*radius, 2*radius)
      ctx!.closePath()
      ctx!.fillStyle = color
      ctx!.fill()
      ctx!.beginPath()
      ctx!.rect((width-w)/2+radius, height-(height-h)/2-2*radius, w-2*radius, 2*radius)
      ctx!.closePath()
      ctx!.fillStyle = color
      ctx!.fill()
      ctx!.drawImage(img, (width-w)/2, (height-h)/2+radius, w, h-2*radius)
    } else if (gift.type == 'speaker') {
      const snapshot = await this.readfileservice.getImageByUrl('../../assets/speaker/snapshot.png')

      let grill = null
      if (gift.grill && gift?.grill !== '') grill = await this.readfileservice.getImageByUrl(gift.grill)

      const play = await this.readfileservice.getImageByUrl('../../assets/play-black.svg')
      const pause = await this.readfileservice.getImageByUrl('../../assets/pause-black.svg')
      const prev = await this.readfileservice.getImageByUrl('../../assets/prev-black.svg')
      const next = await this.readfileservice.getImageByUrl('../../assets/next-black.svg')

      ctx!.drawImage(snapshot, 0, 0, width, height)

      if (grill) {
        const widthGrill = 0.85*width
        const heightGrill = 0.4*height

        ctx!.globalAlpha = 0.5

        ctx!.drawImage(grill, (width-widthGrill)/2, (height-heightGrill)/2, widthGrill, heightGrill)

        ctx!.globalAlpha = 1
      }


      const color = gift.color || '#ff5722'
      const sizeButton = 0.11*width
      const marginButtons = 0.05*width

      ctx!.fillStyle = color
      ctx!.rect(width/2-2*sizeButton-1.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)
      ctx!.rect(width/2-sizeButton-0.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)
      ctx!.rect(width/2+0.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)
      ctx!.rect(width/2+sizeButton+1.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)
      ctx!.fill()

      ctx!.drawImage(play, width/2-2*sizeButton-1.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)
      ctx!.drawImage(pause, width/2-sizeButton-0.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)
      ctx!.drawImage(prev, width/2+0.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)
      ctx!.drawImage(next, width/2+sizeButton+1.5*marginButtons, height/2-0.1*height/2, sizeButton, sizeButton)

    } else if (gift.type == 'tablet') {
      const snapshot = await this.readfileservice.getImageByUrl('../../assets/tablet/snapshot.png')

      ctx!.drawImage(snapshot, 0, 0, width, height)
    } else if (gift.type == 'photo') {
      let h = 0.9*height
      let w = h*(48/64)
      let photo = gift.photo || '../../assets/photo/example.jpg'

      const img = await this.readfileservice.getImageByUrl(photo)

      const photoWidth = 0.9*w
      const photoHeight = 0.67*h

      const ratio1 = photoWidth/photoHeight
      const ratio2 = img.naturalWidth/img.naturalHeight

      let pos = { x: 0, y: 0, w: 0, h: 0 }

      if (ratio1 >= ratio2) {
        pos.h = photoHeight
        pos.w = pos.h*ratio2
      } else if (ratio1 < ratio2) {
        pos.w = photoWidth
        pos.h = pos.w/ratio2
      }
      pos.x = (width-w)/2+(w-pos.w)/2
      pos.y = (height-h)/2+0.1*h+(photoHeight-pos.h)/2

      ctx!.shadowColor = '#ddd'
      ctx!.shadowBlur = 5
      ctx!.fillStyle = 'white'
      ctx!.fillRect((width-w)/2, (height-h)/2, w, h)

      ctx!.drawImage(img, pos.x, pos.y, pos.w, pos.h)
    }

    return cnvs.toDataURL('image/png')
  }

  ngOnInit(): void {
  }
}

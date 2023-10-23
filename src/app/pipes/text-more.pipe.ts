import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textMore'
})
export class TextMorePipe implements PipeTransform {

  transform(value: string, len: number = 20): string {
    let val = value
    if (value.length > len) {
      val = val.substr(0, len-3)+"..."
    }
    return val
  }

}

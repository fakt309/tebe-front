import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-svg-micro',
  templateUrl: './svg-micro.component.html',
  styleUrls: ['./svg-micro.component.scss']
})
export class SvgMicroComponent implements OnInit {

  public usualColor: string = "#999999"
  public recordColor: string = "#d93025"
  @Input() recording: boolean = false

  constructor() { }

  ngOnInit(): void {
  }

}

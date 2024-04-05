import { Component, OnInit, OnDestroy, AfterViewInit, Input, forwardRef, HostListener, ElementRef, ViewChild } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms'
import { LocationService } from '../services/location.service'
import { Subscription } from 'rxjs'
import { AsyncService } from '../async.service'

@Component({
  selector: 'app-desktop-select',
  templateUrl: './desktop-select.component.html',
  styleUrls: ['./desktop-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DesktopSelectComponent),
    multi: true
  }]
})
export class DesktopSelectComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  @Input() options: Array<{ title: string; value: string }> = []
  @Input() isNull: boolean = true
  @Input() withoutNumber: boolean = false

  @ViewChild('listOptionsRef', { read: ElementRef }) listOptionsRef!: ElementRef

  show: boolean = false

  subs: Array<Subscription> = []

  control: FormControl = new FormControl('')

  value: string = ''

  filteredOptions: Array<{ title: string; value: string }> = []

  changeFunc!: Function
  touchFunc!: Function

  constructor(
    private asyncService: AsyncService,
    private host: ElementRef,
    public locationService: LocationService
  ) { }

  @HostListener('window:click', ['$event']) onClick(e: any): void {
    let currTarget = e.target

    let insideSelect = false
    while (currTarget && currTarget.tagName !== 'BODY') {
      if (currTarget.tagName === 'APP-DESKTOP-SELECT') {
        insideSelect = true
      }
      currTarget = currTarget.parentNode
    }

    if (!insideSelect) this.show = false

  }

  @HostListener('window:resize') onResize(): void {
    this.setListWidth()
  }

  setOptions(value: string): void {
    this.control.setValue(this.options.find((o: any) => o.value === value)?.title || value)
    this.show = false
  }

  writeValue(value: any): void {
    this.control.setValue(value)
  }

  registerOnChange(fn: any): void {
    this.changeFunc = fn
  }

  registerOnTouched(fn: any): void {
    this.touchFunc = fn
  }

  setDisabledState(isDisabled: boolean): void {

  }

  setListWidth(): void {
    const rect = this.host.nativeElement.getBoundingClientRect()
    this.listOptionsRef.nativeElement.style.width = `${rect.width-2}px`
  }

  filterOptions(): void {
    let value = this.control.value
    let options = this.options
    
    this.filteredOptions = this.options.filter((option: any) => {
      let regexp = new RegExp(`^.*${value}.*$`, 'g')
      return regexp.test(option.title)
    })

  }

  ngOnInit(): void {

    this.filteredOptions = this.options

  }

  ngAfterViewInit(): void {
    this.setListWidth()

    this.subs.push(
      this.control.valueChanges.subscribe((value: string) => {
        if (this.withoutNumber) {
          value = value.replace(/[0-9]/g, '')
        }
        this.control.setValue(value, { emitEvent: false })

        this.filterOptions()
        let option = this.options.find((o: any) => o.title === value)
        if (option) {
          this.changeFunc(option.value)
        } else {
          this.changeFunc(value)
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe())
  }

}

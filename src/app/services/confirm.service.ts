import { Injectable, ApplicationRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core'
import { DesktopConfirmComponent } from '../desktop-confirm/desktop-confirm.component'

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  component!: ComponentRef<DesktopConfirmComponent>

  constructor(
    private appRef: ApplicationRef,
    private cfr: ComponentFactoryResolver
  ) { }

  show(
    container: ViewContainerRef,
    target: HTMLElement,
    text: string,
    callback: (res: boolean) => void
  ): void {
    const component = this.cfr.resolveComponentFactory(DesktopConfirmComponent)
    this.component = container.createComponent(component)
    this.component.instance.text = text;
    this.component.instance.target = target;
    this.component.instance.result.subscribe(callback)
  }

  hide(): void {
    this.component.destroy()
  }
}

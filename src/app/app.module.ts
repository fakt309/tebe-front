import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { BrowserModule } from '@angular/platform-browser'
import { MatRippleModule } from '@angular/material/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatSliderModule } from '@angular/material/slider'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component'
// import { ServiceWorkerModule } from '@angular/service-worker'
import { TouchPageCreateStage1Component } from './touch-page-create-stage1/touch-page-create-stage1.component'
import { TouchScrollComponent } from './touch-scroll/touch-scroll.component'
import { TouchGiftslistOptionComponent } from './touch-giftslist-option/touch-giftslist-option.component'
import { TouchMenuComponent } from './touch-menu/touch-menu.component'
import { SvgHandleComponent } from './svg-handle/svg-handle.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TouchScreenComponent } from './touch-screen/touch-screen.component'
import { TouchGiftlistaddOptionComponent } from './touch-giftlistadd-option/touch-giftlistadd-option.component'
import { TouchEmptyGiftslistComponent } from './touch-empty-giftslist/touch-empty-giftslist.component'
import { GreetingCardComponent } from './greeting-card/greeting-card.component'
import { GameComponent } from './game/game.component'
import { SpeakerComponent } from './speaker/speaker.component'
import { TabletComponent } from './tablet/tablet.component'
import { PhotoComponent } from './photo/photo.component'
import { TouchViewGiftComponent } from './touch-view-gift/touch-view-gift.component'
import { TouchRenameComponent } from './touch-rename/touch-rename.component'
import { TextMorePipe } from './pipes/text-more.pipe'
import { TouchTrimComponent } from './touch-trim/touch-trim.component'
import { TouchOptionTrimlistComponent } from './touch-option-trimlist/touch-option-trimlist.component'
import { TouchErrorComponent } from './touch-error/touch-error.component'
import { TouchSignGreetingcardComponent } from './touch-sign-greetingcard/touch-sign-greetingcard.component'
import { TouchDrawComponent } from './touch-draw/touch-draw.component'
import { TouchDrawSvgComponent } from './touch-draw-svg/touch-draw-svg.component'
import { TouchScrollFragmentsComponent } from './touch-scroll-fragments/touch-scroll-fragments.component'
import { TouchMicroComponent } from './touch-micro/touch-micro.component'
import { SvgMicroComponent } from './svg-micro/svg-micro.component'
import { TouchConfirmComponent } from './touch-confirm/touch-confirm.component'
import { TouchListenComponent } from './touch-listen/touch-listen.component'
import { WebCameraComponent } from './web-camera/web-camera.component'
import { TouchWatchComponent } from './touch-watch/touch-watch.component'
import { TouchTakePictureComponent } from './touch-take-picture/touch-take-picture.component'
import { TouchSignPhotoComponent } from './touch-sign-photo/touch-sign-photo.component'
import { TouchRefreshComponent } from './touch-refresh/touch-refresh.component'
import { PageCreateComponent } from './page-create/page-create.component'
import { DesktopPageCreateStage1Component } from './desktop-page-create-stage1/desktop-page-create-stage1.component'
import { DesktopButtonComponent } from './desktop-button/desktop-button.component'
import { DesktopEmptyGiftlistComponent } from './desktop-empty-giftlist/desktop-empty-giftlist.component'
import { DesktopAddGiftComponent } from './desktop-add-gift/desktop-add-gift.component'
import { DesktopAddGiftListOptionComponent } from './desktop-add-gift-list-option/desktop-add-gift-list-option.component'
import { DesktopGiftListOptionComponent } from './desktop-gift-list-option/desktop-gift-list-option.component'
import { DesktopEditGiftComponent } from './desktop-edit-gift/desktop-edit-gift.component'
import { DesktopTrimComponent } from './desktop-trim/desktop-trim.component'
import { DesktopListImagesComponent } from './desktop-list-images/desktop-list-images.component'
import { DesktopErrorComponent } from './desktop-error/desktop-error.component'
import { DesktopSignGreetingcardComponent } from './desktop-sign-greetingcard/desktop-sign-greetingcard.component'
import { DesktopDrawSvgComponent } from './desktop-draw-svg/desktop-draw-svg.component'
import { DesktopMicroComponent } from './desktop-micro/desktop-micro.component'
import { DesktopListPlatformsComponent } from './desktop-list-platforms/desktop-list-platforms.component'
import { DesktopWebcamVideoComponent } from './desktop-webcam-video/desktop-webcam-video.component'
import { DesktopListSideComponent } from './desktop-list-side/desktop-list-side.component'
import { DesktopTakePictureComponent } from './desktop-take-picture/desktop-take-picture.component'
import { DesktopSignPhotoComponent } from './desktop-sign-photo/desktop-sign-photo.component'
import { DesktopConfirmComponent } from './desktop-confirm/desktop-confirm.component'
import { DesktopDialogComponent } from './desktop-dialog/desktop-dialog.component'
import { TouchSelectLocationComponent } from './touch-select-location/touch-select-location.component'
import { DesktopSelectLocationComponent } from './desktop-select-location/desktop-select-location.component'
import { TouchPageCreateStage2Component } from './touch-page-create-stage2/touch-page-create-stage2.component'
import { TouchScreenStaticComponent } from './touch-screen-static/touch-screen-static.component'
import { TouchScrollFragmentsComponentRefresh } from './touch-scroll-fragments-refresh/touch-scroll-fragments-refresh.component';
import { TouchMoneyPackComponent } from './touch-money-pack/touch-money-pack.component';
import { TouchSlideMoneyComponent } from './touch-slide-money/touch-slide-money.component';
import { DesktopPageCreateStage2Component } from './desktop-page-create-stage2/desktop-page-create-stage2.component';
import { DesktopRadioComponent } from './desktop-radio/desktop-radio.component';
import { DesktopSelectComponent } from './desktop-select/desktop-select.component';
import { DesktopInputNumberComponent } from './desktop-input-number/desktop-input-number.component';
import { DesktopSlideMoneyComponent } from './desktop-slide-money/desktop-slide-money.component';
import { TouchPageCreateStage3Component } from './touch-page-create-stage3/touch-page-create-stage3.component';
import { BoxComponent } from './box/box.component';
import { TouchContextDirective } from './directives/touch-context.directive';
import { DesktopPageCreateStage3Component } from './desktop-page-create-stage3/desktop-page-create-stage3.component';
import { TouchPageBoxComponent } from './touch-page-box/touch-page-box.component';
import { PageBoxComponent } from './page-box/page-box.component';
import { DesktopPageBoxComponent } from './desktop-page-box/desktop-page-box.component';
import { PageHomeComponent } from './page-home/page-home.component';
import { PageViewComponent } from './page-view/page-view.component';
import { PageRefreshComponent } from './page-refresh/page-refresh.component';
import { TouchPageViewComponent } from './touch-page-view/touch-page-view.component';
import { TouchLockComponent } from './touch-lock/touch-lock.component';
import { TouchTextCopyComponent } from './touch-text-copy/touch-text-copy.component';
import { DesktopPageViewComponent } from './desktop-page-view/desktop-page-view.component';
import { DesktopLockComponent } from './desktop-lock/desktop-lock.component';
import { DesktopPageCreateStage4Component } from './desktop-page-create-stage4/desktop-page-create-stage4.component';
import { TouchPageCreateStage4Component } from './touch-page-create-stage4/touch-page-create-stage4.component';

@NgModule({
  declarations: [
    AppComponent,
    TouchPageCreateStage1Component,
    TouchScrollComponent,
    TouchGiftslistOptionComponent,
    TouchMenuComponent,
    SvgHandleComponent,
    TouchScreenComponent,
    TouchGiftlistaddOptionComponent,
    TouchEmptyGiftslistComponent,
    GreetingCardComponent,
    GameComponent,
    SpeakerComponent,
    TabletComponent,
    PhotoComponent,
    TouchViewGiftComponent,
    TouchRenameComponent,
    TextMorePipe,
    TouchTrimComponent,
    TouchOptionTrimlistComponent,
    TouchErrorComponent,
    TouchSignGreetingcardComponent,
    TouchDrawComponent,
    TouchDrawSvgComponent,
    TouchScrollFragmentsComponent,
    TouchMicroComponent,
    SvgMicroComponent,
    TouchConfirmComponent,
    TouchListenComponent,
    WebCameraComponent,
    TouchWatchComponent,
    TouchTakePictureComponent,
    TouchSignPhotoComponent,
    TouchRefreshComponent,
    PageCreateComponent,
    DesktopPageCreateStage1Component,
    DesktopButtonComponent,
    DesktopEmptyGiftlistComponent,
    DesktopAddGiftComponent,
    DesktopAddGiftListOptionComponent,
    DesktopGiftListOptionComponent,
    DesktopEditGiftComponent,
    DesktopTrimComponent,
    DesktopListImagesComponent,
    DesktopErrorComponent,
    DesktopSignGreetingcardComponent,
    DesktopDrawSvgComponent,
    DesktopListPlatformsComponent,
    DesktopMicroComponent,
    DesktopWebcamVideoComponent,
    DesktopListSideComponent,
    DesktopTakePictureComponent,
    DesktopSignPhotoComponent,
    DesktopConfirmComponent,
    DesktopDialogComponent,
    TouchSelectLocationComponent,
    DesktopSelectLocationComponent,
    TouchPageCreateStage2Component,
    TouchScreenStaticComponent,
    TouchScrollFragmentsComponentRefresh,
    TouchMoneyPackComponent,
    TouchSlideMoneyComponent,
    DesktopPageCreateStage2Component,
    DesktopRadioComponent,
    DesktopSelectComponent,
    DesktopInputNumberComponent,
    DesktopSlideMoneyComponent,
    TouchPageCreateStage3Component,
    BoxComponent,
    TouchContextDirective,
    DesktopPageCreateStage3Component,
    TouchPageBoxComponent,
    PageBoxComponent,
    DesktopPageBoxComponent,
    PageHomeComponent,
    PageViewComponent,
    PageRefreshComponent,
    TouchPageViewComponent,
    TouchLockComponent,
    TouchTextCopyComponent,
    DesktopPageViewComponent,
    DesktopLockComponent,
    DesktopPageCreateStage4Component,
    TouchPageCreateStage4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatRippleModule,
    BrowserAnimationsModule,
    FormsModule,
    DragDropModule,
    MatSliderModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

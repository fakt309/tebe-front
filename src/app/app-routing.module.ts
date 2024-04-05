import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PageHomeComponent } from './page-home/page-home.component'
import { PageCreateComponent } from './page-create/page-create.component'
import { PageBoxComponent } from './page-box/page-box.component'
import { PageViewComponent } from './page-view/page-view.component'
import { PageRefreshComponent } from './page-refresh/page-refresh.component'


const routes: Routes = [
  {
    component: PageHomeComponent,
    path: ''
  }, {
    component: PageCreateComponent,
    path: 'c'
  }, {
    component: PageBoxComponent,
    path: 'i/:id'
  }, {
    component: PageViewComponent,
    path: 'v/:id'
  }, {
    component: PageRefreshComponent,
    path: 'refresh'
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

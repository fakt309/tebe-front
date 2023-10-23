import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PageCreateComponent } from './page-create/page-create.component'

const routes: Routes = [
  {
    component: PageCreateComponent,
    path: '' // create
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

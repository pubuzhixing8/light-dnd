import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppBasicComponent } from './basic/basic.component';
import { AppInnerScrollComponent } from './inner-scroll/inner-scroll.component';

const routes: Routes = [
  {
    path: '',
    component: AppBasicComponent
  },
  {
    path: 'inner-scroll',
    component: AppInnerScrollComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

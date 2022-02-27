import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppBasicComponent } from './basic/basic.component';

const routes: Routes = [
  {
    path: '',
    component: AppBasicComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

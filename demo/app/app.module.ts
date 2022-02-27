import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TritonModule } from 'light-dnd';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppBasicComponent } from './basic/basic.component';

@NgModule({
  declarations: [
    AppComponent,
    AppBasicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TritonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TritonModule } from 'light-dnd';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppBasicComponent } from './basic/basic.component';
import { AppInnerScrollComponent } from './inner-scroll/inner-scroll.component';

@NgModule({
  declarations: [
    AppComponent,
    AppBasicComponent,
    AppInnerScrollComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TritonModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

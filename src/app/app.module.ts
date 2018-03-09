import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import {LasDirPipe} from './pipe/last-dir.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LasDirPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

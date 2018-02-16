import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AvailableRoutes } from './app-routing.module';

import {MatCheckboxModule, MatToolbarModule, MatInputModule} from '@angular/material';

import { AppComponent } from './app.component';
import { PhotosComponent } from './photos/photos.component';

@NgModule({
  declarations: [
    AppComponent,
    PhotosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCheckboxModule, MatToolbarModule, MatInputModule,
    RouterModule,
    RouterModule.forRoot(AvailableRoutes),
  ],
  exports: [
    MatCheckboxModule, MatToolbarModule, MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

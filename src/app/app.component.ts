import { Component, OnInit, NgZone } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ipcRenderer} from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  photosFolders = [];
  photosByDate = [{date: '00/00/0000', uris: ['url1', 'url2']} ];
  photosPath = [];

  constructor(private zone: NgZone, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    ipcRenderer.on('new-photo-folder', (event, message) => {
      this.addFolder(message[0]);
    });
    ipcRenderer.on('new-photos', (event, message) => {
      this.addPhotos(message);
    });
  }

  addFolder(folder) {
    this.photosFolders.push(folder);
    //this.zone.run(() => {});
  }

  addPhotos(photoFilesPaths) {
    console.log('receive new-photos event');
    console.log("Before" + photoFilesPaths);
    this.photosPath = this.photosPath.concat(photoFilesPaths.map(path => this.sanitizer.bypassSecurityTrustUrl(path)));
    console.log("After" + this.photosPath);
    this.zone.run(() => {});
  }
}

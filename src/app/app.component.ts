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
  photoPpt = null;

  constructor(private zone: NgZone, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    ipcRenderer.on('new-photo-folder', (event, message) => {
      this.addFolder(message[0]);
    });
    ipcRenderer.on('new-photos', (event, message) => {
      this.addPhotos(message);
    });
    ipcRenderer.on('show-photo-ppt', (event, message) => {
      this.photoPpt = message;
      this.zone.run(() => {});
    });
    ipcRenderer.on('init-data', (event, message) => {
      this.photosFolders = message.folders;
      console.log(message);
      this.zone.run(() => {});
    });
    ipcRenderer.on('display-folder-photos', (event, message) => {
      console.log('Display photos asked by user');
      this.displayFolderPhotos(message);
    });
    ipcRenderer.send('ready-to-init-data');
  }

  addFolder(folder) {
    this.photosFolders.push(folder);
  }

  addPhotos(photoFilesPaths) {
    console.log('receive new-photos event');
    console.log('Before' + photoFilesPaths);
    this.photosPath = this.photosPath.concat(photoFilesPaths);
    console.log('After' + this.photosPath);
    this.zone.run(() => {});
  }

  showPhotoProperties(photoPath) {
    ipcRenderer.send('get-photo-ppt', photoPath);
  }

  loadFolderPhotos(folder) {
    console.log('User has clicked click on a folder');
    ipcRenderer.send('get-photos-uri-from-folder', folder);
  }

  displayFolderPhotos(paths) {
    this.photosPath = paths;
    this.zone.run(() => {});
  }
}

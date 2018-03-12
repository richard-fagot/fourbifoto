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
  selectedFolder = -1;

  constructor(private zone: NgZone, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    ipcRenderer.on('new-photo-folder', (event, message) => {
      console.log('Event ' + 'new-photo-folder' );
      this.addFolder(message);
    });
    ipcRenderer.on('new-photos', (event, message) => {
      this.addPhotos(message);
    });
    ipcRenderer.on('show-photo-ppt', (event, message) => {
      this.photoPpt = message;
      console.log('Date ' + this.photoPpt.date);
      this.zone.run(() => {});
    });
    ipcRenderer.on('init-data', (event, message) => {
      this.photosFolders = message.folders;
      this.zone.run(() => {});
    });
    ipcRenderer.on('display-folder-photos', (event, message) => {
      console.log('Received event ' + 'display-folder-photos');
      this.displayFolderPhotos(message);
    });
    ipcRenderer.send('ready-to-init-data');
  }

  addFolder(folder) {
    console.log('Add folder ' + folder);
    this.photosFolders.push(folder);
    this.loadFolderPhotos(folder, this.photosFolders.length - 1);
  }

  addPhotos(photoFilesPaths) {
    this.photosPath = this.photosPath.concat(photoFilesPaths);
    this.zone.run(() => {});
  }

  showPhotoProperties(photoPath) {
    ipcRenderer.send('get-photo-ppt', photoPath);
  }

  loadFolderPhotos(folder, index) {
    console.log('Load folder photo ' + folder + ' at index ' + index);
    console.log('User has clicked click on a folder');
    this.selectedFolder = index;
    ipcRenderer.send('get-photos-uri-from-folder', folder);
  }

  displayFolderPhotos(paths) {
    console.log('::displayFolderPhotos() ' + JSON.stringify(paths));
    this.photosPath = paths;
    this.zone.run(() => {});
  }

  getPhotosDateGroups(): Array<string> {
    return Object.keys(this.photosPath);
  }
}

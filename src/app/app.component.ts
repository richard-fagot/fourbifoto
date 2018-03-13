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

  albumAdded: string;
  albums = [];
  selectedAlbum = -1;

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
      console.log('#EVENT: init-data');
      console.log('message: ' + message);
      this.photosFolders = message.appPpt.folders;
      this.albums = message.albums;
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
    console.log('::showPhotoProperties ' + photoPath);
    ipcRenderer.send('get-photo-ppt', photoPath);
  }

  loadFolderPhotos(folder, index) {
    console.log('Load folder photo ' + folder + ' at index ' + index);
    console.log('User has clicked click on a folder');
    this.selectedFolder = index;
    ipcRenderer.send('get-photos-uri-from-folder', folder);
  }

  loadPhotosFromAlbum(album: string, albumItemIndex: number) {
    this.selectedAlbum = albumItemIndex;
    ipcRenderer.send('get-photos-uri-from-album', album);
  }

  displayFolderPhotos(paths) {
    console.log('::displayFolderPhotos() ' + JSON.stringify(paths));
    this.photosPath = paths;
    this.zone.run(() => {});
  }

  getPhotosDateGroups(): Array<string> {
    // Ordering here is needed as the ipc.send reorder objects
    return Object.keys(this.photosPath).sort(this.orderDateDesc);
  }

  orderDateDesc(a, b): number {
    const da = new Date(a);
    const db = new Date(b);
    if (da < db) {return 1; }
    if (da > db) {return -1; }
    return 0;
  }

  onAlbumSubmit() {
    console.log('::onAlbumSubmit');
    this.photoPpt.albums.push(this.albumAdded);
    if (!(this.albums.includes(this.albumAdded))) {
      this.albums.push(this.albumAdded);
    }
    ipcRenderer.send('persist-album', this.photoPpt);
    this.albumAdded = null;
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.albumAdded); }
}

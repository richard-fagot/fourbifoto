import { Component, OnInit, NgZone } from '@angular/core';
import {ipcRenderer} from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  photosFolders = [];
  photosByDate = [{date: '00/00/0000', uris: ['url1', 'url2']} ];

  constructor(private zone: NgZone) {}

  ngOnInit() {
    ipcRenderer.on('new-photo-folder', (event, message) => {
      this.addFolder(message[0]);
    });
  }

  addFolder(folder) {
    this.photosFolders.push(folder);
    this.zone.run(() => {});
  }
}

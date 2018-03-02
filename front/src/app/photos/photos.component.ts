import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  public photos: any;

  constructor(private http: HttpClient, private location: Location) {
    this.photos = [];
  }

  ngOnInit() {
    this.location.subscribe(() => {
        this.refresh();
    });
    this.refresh();
  }

  private refresh() {
    this.http.get('http://localhost:8000/photos')
        // .map(result => result.json())
        .subscribe(result => {
          console.log(result)
            this.photos = result;
        });
}
}

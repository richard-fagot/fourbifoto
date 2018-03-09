import { Pipe, PipeTransform } from '@angular/core';
const path = require('path');

@Pipe({name: 'lastDir'})
export class LasDirPipe implements PipeTransform {
  transform(photoPath: string): string {
    console.log('Path delimiter ' + path.sep);
    return photoPath.substr(photoPath.lastIndexOf(path.sep) + 1);
  }
}

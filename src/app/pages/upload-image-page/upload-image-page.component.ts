import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Image } from '../../models/image';
import { CommonService } from '../../services/common-servces/common.service';


@Component({
  selector: 'app-upload-image-page',
  templateUrl: './upload-image-page.component.html',
  styleUrls: ['./upload-image-page.component.css']
})
export class UploadImagePageComponent implements OnInit {

  @Output() url = new EventEmitter<string>();
  imageSelected: Image;
  fileSelected: any;
  progress: { percentage: number } = { percentage: 0 };

  constructor(private common:CommonService) { }

  ngOnInit() {
  }

  getFile(event) {
    this.fileSelected = event.target.files;
    let image = this.fileSelected.item(0)
    this.imageSelected = new Image(image);
    this.common
      .saveImage(this.imageSelected, this.progress)
      .then((url: string) => this.url.emit(url))
      .catch(erro => console.log(erro));
  }

}

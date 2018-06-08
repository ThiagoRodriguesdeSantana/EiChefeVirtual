import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Image } from '../../models/image';
import { CommonService } from '../../services/common-servces/common.service';
import { NgxSpinnerService } from 'ngx-spinner';  



@Component({
  selector: 'app-upload-image-page',
  templateUrl: './upload-image-page.component.html',
  styleUrls: ['./upload-image-page.component.css']
})
export class UploadImagePageComponent implements OnInit {

  @Output() url = new EventEmitter<string>();
  imageSelected: Image;
  fileSelected: any;
  fetchingImage:boolean = false;
  progress: { percentage: number } = { percentage: 0 };

  constructor(public common:CommonService, public spinner: NgxSpinnerService) { }

  public loading = false;
  ngOnInit() {
  }

  getFile(event) {
    this.fileSelected = event.target.files;
    //this.spinner.show();
    this.fetchingImage = true;
    let image = this.fileSelected.item(0)
    this.imageSelected = new Image(image);
    this.common
      .saveImage(this.imageSelected, this.progress)
      .then((url: string)=> {
        this.url.emit(url);
        this.fetchingImage = false;
        //this.spinner.hide();
      })
      .catch(erro => console.log(erro));
  }

}

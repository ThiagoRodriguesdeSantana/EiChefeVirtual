import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-servces/common.service';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.css']
})
export class HeaderPageComponent implements OnInit {

  constructor(private common:CommonService) { }

  ngOnInit() {
  }

  logout(){
    this.common.logaout();
  }


}

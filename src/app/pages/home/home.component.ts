import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/db-services/entity.service';
import { Entity } from '../../models/entity';
import { CommonService } from '../../services/common-servces/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  email: string;
  entity: Entity;
  hight:any;
  constructor(private serviceEntity: EntityService,
  private common:CommonService) {
    this.hight = window.screen.height;
   }

  ngOnInit() {

    this.serviceEntity.entityLoeaded$.subscribe(res => {
      if (!res.$key) {
        this.serviceEntity.loadEntity();
        return;
      }
      this.entity = res;
    });
  }

}

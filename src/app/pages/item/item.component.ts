import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/db-services/entity.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  constructor(public entityService:EntityService) { }

  ngOnInit() {
  }

}

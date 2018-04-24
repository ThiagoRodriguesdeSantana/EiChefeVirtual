import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../../services/db-services/entity.service';
import { ItemToForm } from '../modelOrderItem/item-to-form';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-order-itens',
  templateUrl: './order-itens.component.html',
  styleUrls: ['./order-itens.component.css']
})
export class OrderItensComponent implements OnInit {

  item: ItemToForm;
  itemSelectes:boolean = false;
  constructor(private entityService: EntityService) { }

  ngOnInit() {
  }

  itemSelected(event) {
    if(event){
      this.itemSelectes = true;
      this.item = event;
    }
  }
  finalize(){
    this.item.finalized = true;
  }
}

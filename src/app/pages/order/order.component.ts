import { Tables } from './../../models/Tables';
import { Order } from './../../models/order';
import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/db-services/entity.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  
  selectedOrder: boolean;
  selectedTable: boolean;
  table: Tables;
  
  constructor(private entityService: EntityService) {

  }

  ngOnInit() {
    this.getEntity()
  }

  getEntity() {
    if (!this.entityService.entitySelected.$key) {
      this.entityService.entityLoeaded$.subscribe(ent => {
        if (!ent.$key) {
          this.entityService.loadEntity();
          return;
        }
        this.entityService.entitySelected = ent;
      });
    }

  }

  tableSelected(event){
    if(event){
      this.selectedTable = true;
      this.entityService.getTableByNumber(event);
      this.table = this.entityService.tableSelected;
      console.log(event);
    }
  }

  orderSelected(event){
    if(event){
      this.selectedOrder = true;
      this.entityService.getOrderByEmail(event);
      console.log(this.entityService.orderSelected);
    }
  }
}


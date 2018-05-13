import { Tables } from './../../models/Tables';
import { Order } from './../../models/order';
import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../services/db-services/entity.service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ItemToForm } from '../../models/item-to-form';
import { ItemOrder } from '../../models/itemOrder';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  

  order: ItemToForm[];
  selectedOrder: boolean;
  selectedTable: boolean;
  table: Tables;
  teste = 'teste de teste'
  
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
      
      this.selectedOrder = true;
       //this.table = this.entityService.tableSelected;
       console.log(event);
    }
  }

  orderSelected(event){
    if(event){
      this.selectedOrder = true;
      this.entityService.orderSelected = event;
      this.getItemToForm();
    }
  }

  getItemToForm(){

    this.order = [];
    this.entityService.orderSelected.itens.forEach((orderSelected:ItemOrder) => {
      let itemToform = new ItemToForm();
      itemToform.chaveDoPedido = this.entityService.orderSelected.numeroDoPedido;
      itemToform.codItem = orderSelected.item.codigo;
      itemToform.descItem = orderSelected.item.descricao;
      itemToform.finalized = orderSelected.antendido;
      itemToform.obs = orderSelected.observacao;
      itemToform.priceItem = orderSelected.item.preco;
      itemToform.qtdItem = orderSelected.quantidade;
      this.order.push(itemToform);
    })
  }
}


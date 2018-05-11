import { EntityService } from './../../../services/db-services/entity.service';
import { Order } from './../../../models/order';
import { Component, OnInit, Input } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { ItemToForm } from '../../../models/item-to-form';

@Component({
  selector: 'app-order-itens',
  templateUrl: './order-itens.component.html',
  styleUrls: ['./order-itens.component.css']
})
export class OrderItensComponent implements OnInit {

  item: ItemToForm;
  itemSelectes:boolean = false;
  emailClient:string;
  hourOrder:Date;
  @Input() order:Order;

  constructor(private entityService: EntityService) { 
    this.emailClient = this.entityService.orderSelected.emailDoCliente;
    this.hourOrder = this.entityService.orderSelected.horaDoPedido;
  }

  ngOnInit() {
  }

  itemSelected(event) {
    if(event){
      this.itemSelectes = true;
      this.item = event;
    }
  }
  finalize(){
    try {
      this.entityService.finalizeOrder();
      alert('Pedido finalizado com sucesso!')
    } catch (error) {
     alert(error) 
    }
  }
}

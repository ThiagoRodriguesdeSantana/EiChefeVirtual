import { EntityService } from './../../../services/db-services/entity.service';
import { Component, OnInit } from '@angular/core';
import { Entity } from '../../../models/entity';
import { Item } from '../../../models/item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  constructor(private entityService:EntityService) { }

  ngOnInit() {
   
  }

  editItem(item: Item) {
    alert('entrou')
    this.entityService.itemSelected = Object.assign({}, item);
  }
  removeItem(id: string){
    if (confirm('Deseja remover esse item ?') == true) {
      this.entityService.removeItem(id);
      alert('Item removido com sucesso!')
    }
  }

}

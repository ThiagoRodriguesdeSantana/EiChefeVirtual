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

  search: string;
  displayedColumns = ['Código', 'Descricao', 'Preço', 'Tipo','Editar/Remover'];
  listNoFilter: Array<Item>;
  constructor(private entityService: EntityService) { }

  ngOnInit() {

  }

  getItemByDesctiption(event) {

    if (!this.listNoFilter) {
      this.listNoFilter = this.entityService.entitySelected.itens;
    }
    if (this.search == "") {
      this.entityService.entitySelected.itens = this.listNoFilter;
      return;
    }

    this.entityService.entitySelected.itens = this.entityService.entitySelected.itens.filter(f => {
      return f.descricao.substring(0, this.search.length) == this.search
    });
  }

  editItem(item: Item) {
    if (this.listNoFilter.length > 0) {
      this.entityService.entitySelected.itens = this.listNoFilter;
    }
    console.log(this.entityService.entitySelected.itens);
    this.entityService.itemSelected = Object.assign({}, item);
  }
  removeItem(id: string) {
    if (!this.listNoFilter) {
      this.listNoFilter = this.entityService.entitySelected.itens;
    }
    if (confirm('Deseja remover esse item ?') == true) {
      this.entityService.removeItem(id);
      alert('Item removido com sucesso!')
    }
  }
}

import { Item } from './../../../../models/item';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ItemToForm } from '../../modelOrderItem/item-to-form';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityService } from '../../../../services/db-services/entity.service';

@Component({
  selector: 'app-order-itens-list',
  templateUrl: './order-itens-list.component.html',
  styleUrls: ['./order-itens-list.component.css']
})
export class OrderItensListComponent implements OnInit {


  @Output() itemOrderSelected = new EventEmitter<ItemToForm>();

  displayedColumns = ['finalized', 'codItem', 'descItem', 'qtdItem', 'priceItem', 'obs'];
  dataSource = new MatTableDataSource<ItemToForm>(new Array<ItemToForm>());
  selection = new SelectionModel<ItemToForm>(true, []);
  itensToForm = new Array<ItemToForm>();
  itemCarregados = false;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.fillForm();
    console.log('Entrou');
  }

  fillForm() {
    this.entityService.orderSelected.itens.forEach((item) => {
      let itemToform = new ItemToForm();
      itemToform.codItem = item.item.codigo;
      itemToform.descItem = item.item.descricao;
      itemToform.finalized = false;
      itemToform.obs = item.observacao;
      itemToform.priceItem = item.item.preco;
      itemToform.qtdItem = item.quantidade;
      this.itensToForm.push(itemToform);
    })
  }

  isSelected(row) {
    return row.pedidoEmAberto;
  }
  getValue(event) {
    console.log(event);
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    alert('isAllSelected()');
    return numSelected === numRows;
  }

  getSelectedRow(row) {
    this.itemOrderSelected.emit(row);
  }

}

import { Order } from './../../../../models/order';
import { Item } from './../../../../models/item';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityService } from '../../../../services/db-services/entity.service';
import { ItemToForm } from '../../../../models/item-to-form';

@Component({
  selector: 'app-order-itens-list',
  templateUrl: './order-itens-list.component.html',
  styleUrls: ['./order-itens-list.component.css']
})
export class OrderItensListComponent implements OnInit {


  @Output() itemOrderSelected = new EventEmitter<ItemToForm>();
  @Input() itensList: Order[];

  displayedColumns = ['finalized', 'codItem', 'descItem', 'qtdItem', 'priceItem', 'obs'];
  dataSource = new MatTableDataSource<ItemToForm>(new Array<ItemToForm>());
  selection = new SelectionModel<ItemToForm>(true, []);
  itensToForm = new Array<ItemToForm>();
  itemCarregados = false;

  constructor(private entityService: EntityService) { }

  ngOnInit() {

    console.log('tewstesters'+this.itensList);
    
  }


  // fillForm() {
  //   this.entityService.orderSelected.itens.forEach((orderSelected) => {
  //     let itemToform = new ItemToForm();
  //     itemToform.codItem = orderSelected.item.codigo;
  //     itemToform.descItem = orderSelected.item.descricao;
  //     itemToform.finalized = false;
  //     itemToform.obs = orderSelected.observacao;
  //     itemToform.priceItem = orderSelected.item.preco;
  //     itemToform.qtdItem = orderSelected.quantidade;
  //     this.itensToForm.push(itemToform);
  //   })
  // }

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

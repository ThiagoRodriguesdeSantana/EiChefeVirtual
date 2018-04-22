import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ItemToForm } from '../modelOrderItem/item-to-form';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-order-itens-list',
  templateUrl: './order-itens-list.component.html',
  styleUrls: ['./order-itens-list.component.css']
})
export class OrderItensListComponent implements OnInit {

  displayedColumns = ['finalized', 'codItem','descItem','qtdItem','priceItem','obs'];
  dataSource = new MatTableDataSource<ItemToForm>(new Array<ItemToForm>());
  selection = new SelectionModel<ItemToForm>(true, []);
  constructor() { }

  ngOnInit() {
  }

  isSelected(row){
    return row.emAberto
  }
  getValue(event){
    console.log(event);
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        alert('masterToggle()');
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    alert('isAllSelected()');
    return numSelected === numRows;
  }

  getSelectedRow(row){
    
  }

}

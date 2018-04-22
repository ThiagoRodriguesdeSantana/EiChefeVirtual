import { Order } from './../../../models/order';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  @Output() order = new EventEmitter<string>();
  orderSelected: string;
  displayedColumns = ['pedidoEmAberto', 'numeroDoPedido'];
  dataSource = new MatTableDataSource<Order>(new Array<Order>());
  selection = new SelectionModel<Order>(true, []);
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
    this.orderSelected = row.numeroDoPedido;
    this.order.emit(row.numeroDoPedido)
  }

}
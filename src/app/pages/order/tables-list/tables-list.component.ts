import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Tables } from '../../../models/Tables';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityService } from '../../../services/db-services/entity.service';


@Component({
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.css']
})
export class TablesListComponent implements OnInit {

  displayedColumns = ['emAberto', 'numero'];
  dataSource = new MatTableDataSource<Tables>(new Array<Tables>());
  selection = new SelectionModel<Tables>(true, []);

  @Output() table = new EventEmitter<string>();
  tableSelected:string;

  constructor(private entityService: EntityService) {
    
   }

  ngOnInit() {
    let t = this.entityService.entitySelected.mesas;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
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

  getSelectedRow(row){
    this.tableSelected = row.numero;
    this.table.emit(row.numero)
  }
}

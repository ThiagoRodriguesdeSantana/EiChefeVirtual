import { AdditionalValues } from './../../../models/additional-values';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityService } from '../../../services/db-services/entity.service';


@Component({
  selector: 'app-list-additional-values',
  templateUrl: './list-additional-values.component.html',
  styleUrls: ['./list-additional-values.component.css']
})
export class ListAdditionalValuesComponent implements OnInit {


  
  displayedColumns = ['ativo', 'descricao', 'valor'];
  dataSource = new MatTableDataSource<AdditionalValues>(new Array<AdditionalValues>());
  selection = new SelectionModel<AdditionalValues>(true, []);

  type:string;
  @Output() additionalSelected = new EventEmitter<AdditionalValues>();
  constructor(private entityService: EntityService) { }

  ngOnInit() {
  }


  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
      
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  getSelectedRow(row) {
    this.additionalSelected.emit(row);
  }

}

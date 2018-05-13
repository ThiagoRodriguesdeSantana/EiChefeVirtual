import { ClosingRequestToForm } from './../../../models/closing-request-to-form';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EntityService } from '../../../services/db-services/entity.service';

@Component({
  selector: 'app-pagamentos-list',
  templateUrl: './pagamentos-list.component.html',
  styleUrls: ['./pagamentos-list.component.css']
})
export class PagamentosListComponent implements OnInit {

  @Output() closesSelected = new EventEmitter<ClosingRequestToForm>();
  constructor(public entityService: EntityService) { }

  ngOnInit() {
  }

  getSelectedRow(row: ClosingRequestToForm){

    this.closesSelected.emit(row)
  }

}

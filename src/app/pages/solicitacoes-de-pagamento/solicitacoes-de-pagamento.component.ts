import { Component, OnInit } from '@angular/core';
import { ClosingRequestToForm } from '../../models/closing-request-to-form';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityService } from '../../services/db-services/entity.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-solicitacoes-de-pagamento',
  templateUrl: './solicitacoes-de-pagamento.component.html',
  styleUrls: ['./solicitacoes-de-pagamento.component.css']
})
export class SolicitacoesDePagamentoComponent implements OnInit {

  closingSelected: ClosingRequestToForm;
  constructor(public entityService: EntityService) { }

  ngOnInit() {
    this.entityService.requestClosesList
  }

  selected(event:ClosingRequestToForm){
    this.closingSelected = event;
  }

  pay() {

    if(this.closingSelected.estaPago){
      let confitm = confirm('O sitema irá fechar automaticamente esta conta, deseja continuar?');
      if(confirm){
        this.entityService.payment(this.closingSelected);
        alert ('Finalizado com sucesso!');
      }else{
        this.closingSelected.estaPago = false;
      }
    }
  }
}

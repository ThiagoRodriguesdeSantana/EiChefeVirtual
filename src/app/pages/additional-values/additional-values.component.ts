import { AdditionalValues } from './../../models/additional-values';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EntityService } from '../../services/db-services/entity.service';

@Component({
  selector: 'app-additional-values',
  templateUrl: './additional-values.component.html',
  styleUrls: ['./additional-values.component.css']
})
export class AdditionalValuesComponent implements OnInit {

  tipo: string;
  additionalValues: AdditionalValues;

  constructor(public entityService: EntityService) {
    this.additionalValues = new AdditionalValues();
  }

  ngOnInit() {
    this.tipo = 'R$'
  }

  selectedVauel(event: AdditionalValues) {
    if (event) {
      this.additionalValues = event;
    }
  }

  alterType() {
    var val = !this.additionalValues.percentual;
    if (val) {
      this.tipo = '%'

    }
    else {
      this.tipo = 'R$'
      this.additionalValues.valor = this.additionalValues.valor;
    }
  }
  clear() {
    this.additionalValues = new AdditionalValues();
  }

  saveAdditionaValue(additional: AdditionalValues) {
    try {
      if (!this.additionalValues.descricao || this.additionalValues.descricao == '') {
        alert('Deve ser informado um descrição para esse adicional!');
        return
      }
      if (!this.additionalValues.valor) {
        alert('Deve ser informado um valor para esse adicional!');
        return;
      }

      this.entityService.saveAdditional(this.additionalValues);
      alert('Adicional salvo com sucesso!');
      this.clear();

    } catch (error) {
      alert(error);
    }

  }

}

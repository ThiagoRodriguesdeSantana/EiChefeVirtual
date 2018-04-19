import { CommonService } from './../../../services/common-servces/common.service';
import { Component, OnInit } from '@angular/core';
import { EntityService } from '../../../services/db-services/entity.service';
import { Entity } from '../../../models/entity';
import { NgForm } from '@angular/forms';
import { Item } from '../../../models/item';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {



  errorCodItemNotInf: string = "O código do item deve ser informado.";
  errorDescriptionNotInf: string = "A descrição do item deve ser infromada.";
  tipos: string[];
  notInfCodeItem: boolean;
  noInfDescItem: boolean;
  selected:string
  constructor(private entityService: EntityService,
    private common: CommonService) { }

  ngOnInit() {
    this.entityService.itemSelected = new Item();
    this.tipos = ['Comida', 'Bebida', 'Outros'];
    this.entityService.getAllEntities();
    this.getEntity();
    this.selected = this.entityService.itemSelected !=null 
                  ? this.entityService.itemSelected.tipo : 'Tipo' 
  }

  getEntity() {
    if (!this.entityService.entitySelected.$key) {
      this.entityService.entityLoeaded$.subscribe(ent => {
        if (!ent.$key) {
          this.entityService.loadEntity();
          return;
        }
        this.entityService.entitySelected = ent;
      });
    }

  }
  getItemByCode() {


    if (!this.entityService.itemSelected.codigo) {
      this.entityService.itemSelected = new Item();
      return;
    }
    let item = this.entityService.entitySelected.itens
      .find(c => c.codigo == this.entityService.itemSelected.codigo);

    if (item) {
      this.entityService.itemSelected = item
    }

  }
  validNotInfDescription() {
    this.noInfDescItem = !this.entityService.itemSelected.descricao;
    if (this.noInfDescItem) {
      throw new Error(this.errorDescriptionNotInf);
    }
  }
  setValidationsFalse(event) {
    if (!this.noInfDescItem || this.notInfCodeItem) {
      this.noInfDescItem = this.notInfCodeItem = false;
    }
  }

  validIfInfCode() {
    this.notInfCodeItem = !this.entityService.itemSelected.codigo;
    if (this.notInfCodeItem) {
      throw new Error(this.errorCodItemNotInf);
    }
  }
  // selectType(event) {
  //   this.entityService.itemSelected.tipo = event.target.value;
  // }

  saveItem(itemForm: NgForm) {
    try {


      this.validIfInfCode();
      this.validNotInfDescription();

      this.entityService.itemSelected.tipo = this.selected;
      if (this.entityService.itemSelected.tipo == ''
        || this.entityService.itemSelected.tipo == null) {
        this.entityService.itemSelected.tipo = this.tipos[0];
      }

      if (!this.entityService.itemSelected.descricao) {
        this.noInfDescItem = true;
        return;
      }

      this.entityService.saveItens();

      this.entityService.saveEntity(this.entityService.entitySelected);
      alert('Item salvo com sucesso');
      this.entityService.itemSelected = new Item();

    } catch (error) {
      console.log(error);
    }
  }

  getUrlImage(event) {
    this.entityService.itemSelected.imagem = event;
  }
}

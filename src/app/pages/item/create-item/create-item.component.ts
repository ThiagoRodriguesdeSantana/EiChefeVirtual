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


  tipos: string[];
  noInfCodeItem: boolean;
  noInfDescItem: boolean;
  constructor(private entityService: EntityService,
    private common: CommonService) { }

  ngOnInit() {
    this.entityService.itemSelected = new Item();
    this.tipos = ['Comida', 'Bebida', 'Outros'];
    this.entityService.getAllEntities();
    this.getEntity();
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
  selectType(event) {
    this.entityService.itemSelected.tipo = event.target.value;
  }

  saveItem(itemForm: NgForm) {

    if (this.entityService.itemSelected.tipo == ''
      || this.entityService.itemSelected.tipo == null) {
      this.entityService.itemSelected.tipo = this.tipos[0];
    }
    if (!this.entityService.itemSelected.codigo) {
      this.noInfCodeItem = false;
    }

    this.entityService.saveItens();


    this.entityService.saveEntity(this.entityService.entitySelected);
    alert('Item salvo com sucesso');
    this.entityService.itemSelected = new Item();
  }

  getUrlImage(event) {
    this.entityService.itemSelected.imagem = event;
  }
}

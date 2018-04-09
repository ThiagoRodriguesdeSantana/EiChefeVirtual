import { Entity } from './../../models/entity';
import { EntityService } from './../../services/db-services/entity.service';
import { Component, OnInit } from '@angular/core';
import { ViacepService } from '@brunoc/ngx-viacep';
import { EntityValidate } from '../../services/validates/entity-validate';
import { CommonService } from '../../services/common-servces/common.service';
import { Endereco } from '@brunoc/ngx-viacep';
import { CepError } from '@brunoc/ngx-viacep';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {


  confirmPassword:string;
  loginValid: any;
  validPhone: boolean;
  phoneNumber: string;
  cpfValid: boolean;
  cnpjValid: boolean;
  numberPhones: string[];
  count: number;
  indexList: number;
  validate: EntityValidate;

  constructor(private entityService: EntityService,
    private viacep: ViacepService,
    private common: CommonService) { }

  ngOnInit() {
    this.validate = EntityValidate.getInstance();
    this.indexList = -1;
    this.count = 0;
    var e = this.entityService.getAllEntities();
    this.numberPhones = this.entityService.entitySelected.telefones;
    this.validateLoginUser();
  }

  validateLoginUser() {
    let email: string;
    this.common.email$.subscribe(res => {
      email = res;
      this.entityService.getEntityByEmail(email);
    });
  }

  getImage(event) {
    this.entityService.entitySelected.logo = event;
  }

  validateCnpj() {
    this.cnpjValid = this.validate
      .validateCnpj(this.entityService.entitySelected.cnpj);
  }

  validateCpf() {
    this.cpfValid = this.validate
      .validateCpf(this.entityService.entitySelected.cpfDoResponsavel);
  }

  getAdressByCEP() {
    this.viacep.buscarPorCep(this.entityService.entitySelected.cep).then((endereco: Endereco) => {
      this.entityService.entitySelected.bairro = endereco.bairro;
      this.entityService.entitySelected.cidade = endereco.localidade;
      this.entityService.entitySelected.complemento = endereco.complemento;
      this.entityService.entitySelected.rua = endereco.logradouro;
      this.entityService.entitySelected.estado = endereco.uf;
    }).catch((error: CepError) => {
      alert(error.descricao);
      console.log(error.descricao);
    });
  }

  maskPhone(event: any) {
    var number = this.phoneNumber.length;
    if (event.code != "Backspace") {
      if (number == 2) {
        this.phoneNumber = '(' + this.phoneNumber + ')';
      }
      if (number == 9) {
        this.phoneNumber = this.phoneNumber + '-';
      }
    }
    else {
      this.validPhone = true;
    }
  }

  validatePhone() {
    if (this.phoneNumber.length != 14) {
      this.validPhone = false;
    }
    else {
      this.validPhone = true;
    }
  }

  addPhone() {
    if (this.validPhone) {

      if (this.indexList >= 0) {
        this.entityService.entitySelected.telefones[this.count] = this.phoneNumber;
        this.indexList = -1;
      } else {
        this.entityService.entitySelected.telefones[this.count] = this.phoneNumber;
        this.count++;
      }
      this.phoneNumber = '';
    }
  }

  removePhone() {
    delete this.numberPhones[this.indexList];
  }

  selectedLine(item: string, index: number) {
    this.indexList = index;
    this.phoneNumber = item;
  }

  save(entityFom: NgForm) {

    let entitytoSave  = entityFom.value as Entity;
    let newEntity = new Entity().copyTo(this.entityService.entitySelected);

    newEntity.telefones = this.numberPhones;

    this.validatePassword(entitytoSave);
    if (this.cnpjValid && this.cpfValid && this.loginValid) {
      this.entityService.saveEntity(newEntity);
    }
    alert('Salvo com sucesso!');
  }

  validatePassword(entity:Entity){
    if (entity.$key == null) {
      this.loginValid =
        this.validate
          .validateLogin(this.entityService.entitySelected.login.password, this.confirmPassword);
    }
  }


}

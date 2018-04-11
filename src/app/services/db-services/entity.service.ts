import { Entity } from './../../models/entity';
import { Injectable } from '@angular/core';
import { reject } from 'q';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { CommonService } from '../common-servces/common.service';
import { Item } from '../../models/item';
@Injectable()
export class EntityService {



    itemSelected: Item;
    private entity = new BehaviorSubject<Entity>(new Entity());
    entityLoeaded$ = this.entity.asObservable();

    entitySelected: Entity;
    entities: AngularFireList<any>;

    constructor(private firebaseDb: AngularFireDatabase, private common: CommonService) {
        this.entitySelected = new Entity();
    }
    getAllEntities() {
        this.entities = this.firebaseDb.list('empresas');
        return this.entities;
    }

    getEntityByEmail(email: string) {
        let list = Array<Entity>();
        list = [];
        var ref = this.firebaseDb.database
            .ref("empresas")
            .orderByChild("login/email")
            .equalTo(email).on("child_added", (snapshot) => {
                var item = snapshot.val();
                item.$key = snapshot.key;
                list.push(item as Entity)
                this.entitySelected = list[0];
                this.entity.next(this.entitySelected);
            });
    }
    loadEntity() {
        this.common.email$.subscribe(res => {
            let email = res;
            let list = Array<Entity>();
            list = [];
            var ref = this.firebaseDb.database
                .ref("empresas")
                .orderByChild("login/email")
                .equalTo(email).on("child_added", (snapshot) => {
                    var item = snapshot.val();
                    item.$key = snapshot.key;
                    list.push(item as Entity)
                    this.entitySelected = list[0];
                    this.entity.next(this.entitySelected);
                });
        });
    }

    consultarPorCnpj(): any {
        let list = Array<Entity>();
        list = [];

        var ref = this.firebaseDb.database.ref("empresas");
        ref.orderByChild("cnpj").equalTo(this.entitySelected.cnpj).on("child_added", (snapshot) => {
            var item = snapshot.val();
            item.key = snapshot.key;
            list.push(item as Entity)
            return list;
        });
        return list;
    }

    saveEntity(empresa: Entity) {
        if (empresa.logo == '' || empresa.logo == null) {
            empresa.logo = 'gs://comandavirtual-15db8.appspot.com/undefined/help-web-button.png'
        }
        if (empresa.$key == null) {
            return this.insertEntity(empresa);
        } else {
            return this.alterEntity(empresa);
        }
    }

    insertEntity(entity: Entity) {
        this.common.addNewUser(entity.login);
        this.entities.push({
            cnpj: entity.cnpj,
            razaoSocial: entity.razaoSocial,
            nomeDoResponsavel: entity.nomeDoResponsavel,
            cpfDoResponsavel: entity.cpfDoResponsavel,
            cep: entity.cep,
            rua: entity.rua,
            bairro: entity.bairro,
            complemento: entity.complemento,
            cidade: entity.cidade,
            estado: entity.estado,
            telefones: entity.telefones,
            login: entity.login,
            logo: entity.logo,
            quantidadeDeMesas: entity.quantidadeDeMesas
        });
    }

    alterEntity(entity: Entity) {
        this.entities.update(entity.$key, {
            cnpj: entity.cnpj,
            razaoSocial: entity.razaoSocial,
            nomeDoResponsavel: entity.nomeDoResponsavel,
            cpfDoResponsavel: entity.cpfDoResponsavel,
            cep: entity.cep,
            rua: entity.rua,
            bairro: entity.bairro,
            complemento: entity.complemento,
            cidade: entity.cidade,
            estado: entity.estado,
            telefones: entity.telefones,
            logo: entity.logo,
            itens: entity.itens,
            quantidadeDeMesas: entity.quantidadeDeMesas
        });
    }
    deletEntityById($key: string) {
        this.entities.remove($key);
    }

    removeItem(arg0: any): any {
        throw new Error("Method not implemented.");
    }
}

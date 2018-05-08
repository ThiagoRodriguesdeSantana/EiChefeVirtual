import { Tables } from './../../models/Tables';
import { element } from 'protractor';
import { Entity } from './../../models/entity';
import { Injectable } from '@angular/core';
import { reject } from 'q';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { CommonService } from '../common-servces/common.service';
import { Item } from '../../models/item';
import { EntityValidate } from '../validates/entity-validate';
import { Order } from '../../models/order';
import { ItemOrder } from '../../models/itemOrder';
@Injectable()
export class EntityService {



    CLIENTES = 'clientes';
    clientesList: AngularFireList<any>;
    orderSelected: Order;
    itemSelected: Item;
    private entity = new BehaviorSubject<Entity>(new Entity());
    entityLoeaded$ = this.entity.asObservable();
    validate: EntityValidate;

    entitySelected: Entity;
    entities: AngularFireList<any>;

    constructor(private firebaseDb: AngularFireDatabase,
        private common: CommonService) {
        this.entitySelected = new Entity();
        this.clientesList = this.firebaseDb.list(this.CLIENTES);
        this.validate = EntityValidate.getInstance();
        this.reloadEntity();
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
            let ref = this.firebaseDb.database
                .ref("empresas")
                .orderByChild("login/email")
                .equalTo(email).on("child_added", (snapshot) => {
                    let item = snapshot.val();
                    item.$key = snapshot.key;
                    list.push(item as Entity)
                    this.entitySelected = list[0];
                    this.entitySelected.pedidos = Object.values(this.entitySelected.pedidos);
                    this.entity.next(this.entitySelected);
                });
        });
    }

    reloadEntity() {
        var empresa = this.getAllEntities();
        empresa.snapshotChanges().subscribe(item => {
            let empresasList = [];
            item.forEach(element => {
                var empresaListada = element.payload.toJSON();
                empresaListada["$key"] = element.key;
                if (element.key) {
                    this.loadEntity();
                    return;
                };
            })
        })
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

    saveEntity(entity: Entity) {
        //this.generatTables(entity);
        if (entity.logo == '' || entity.logo == null) {
            entity.logo = 'gs://comandavirtual-15db8.appspot.com/undefined/help-web-button.png'
        }
        if (entity.$key == null) {
            return this.insertEntity(entity);
        } else {
            return this.alterEntity(entity);
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
            itens: entity.itens != null ? entity.itens : new Array<Item>(),
            quantidadeDeMesas: entity.quantidadeDeMesas
        });

        this.saveUser(entity.login.email);

    }

    saveUser(email: string) {
        this.clientesList.push({
            usuario: email
        });
    }

    deletEntityById($key: string) {
        this.entities.remove($key);
    }

    removeItem(codigo: string) {
        let itemToRemove = this.getItemFromList(codigo);
        let newList = new Array<Item>();
        this.entitySelected.itens.forEach(c => {
            if (c.codigo != itemToRemove.codigo) {
                newList.push(c);
            }
        })

        this.entitySelected.itens = new Array<Item>();
        this.entitySelected.itens = newList;
        this.saveEntity(this.entitySelected);
    }

    saveItens(): any {

        if (!this.entitySelected.$key) {
            return;
        }

        this.setImegeIfNull();

        if (!this.entitySelected.itens) {
            this.entitySelected.itens = new Array<Item>();
        }

        let itemToUpdate = this.getItemFromList(this.itemSelected.codigo);

        if (itemToUpdate) {
            var index = this.entitySelected.itens.indexOf(itemToUpdate);
            this.entitySelected.itens[index] = this.itemSelected;
        } else {
            this.entitySelected.itens.push(this.itemSelected);
        }

        this.saveEntity(this.entitySelected);
    }

    private setImegeIfNull() {
        if (this.itemSelected.imagem == ''
            || this.itemSelected.imagem == null) {
            this.itemSelected.imagem = this.entitySelected.logo;
        }
    }

    getItemFromList(codigo: string): Item {
        if (this.entitySelected.itens) {
            return this.entitySelected.itens
                .find(c => c.codigo == codigo);
        }
    }

    generatTables(entity: Entity) {
        // entity.mesas = new Array<Tables>();
        // for (let index = 1; index <= entity.quantidadeDeMesas; index++) {
        //     let newTable = new Tables();
        //     newTable.numero = "" + index;
        //     entity.mesas.push(newTable);
        // }
    }

    getTableByNumber(numero: string) {
      
        
    }


    getOrderByEmail(email: string) {
        // if (this.tableSelected.pedidos) {
        //     this.orderSelected = this.tableSelected.pedidos
        //         .find(c => c.emailDoCliente == email);
        // }
    }

}

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

    orderSelected: Order;
    tableSelected: Tables;
    itemSelected: Item;
    private entity = new BehaviorSubject<Entity>(new Entity());
    entityLoeaded$ = this.entity.asObservable();
    validate: EntityValidate;

    entitySelected: Entity;
    entities: AngularFireList<any>;

    constructor(private firebaseDb: AngularFireDatabase, private common: CommonService) {
        this.entitySelected = new Entity();
        this.validate = EntityValidate.getInstance();
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
                    this.obterMesaMokada();
                    this.entity.next(this.entitySelected);
                });
        });
    }

    obterMesaMokada() {
        let mesas : Tables[];
        let mesa = new Tables();

        let pedidos = new Array<Order>();
        let pedido = new Order();
        let itens = new Array<Item>();
        let item = new Item();

        item.codigo = 'I0001';
        item.descricao = 'Teste';
        item.preco = 10.00;
        item.status = true;
        item.tipo = 'comida';
        
        let itemOr = new ItemOrder();
        itemOr.item = item;
        itemOr.antendido= true;
        itemOr.observacao = 'obs do pedido';
        itemOr.quantidade = 2;

        let itemOr2 = new ItemOrder();
        itemOr2.item = item;
        itemOr2.antendido= true;
        itemOr2.observacao = 'obs do pedido';
        itemOr2.quantidade = 2;

        pedido.numeroDoPedido = 'P0001';
        pedido.nomeDoCliente = 'Cliente de Teste';
        pedido.pedidoEmAberto = true;
        pedido.itens = [];

        let pedido2 = new Order();
        pedido2.numeroDoPedido = 'P0002';
        pedido2.nomeDoCliente = 'Cliente de Teste';
        pedido2.pedidoEmAberto = true;
        
        pedido.itens.push(itemOr);
        pedido.itens.push(itemOr2);
        
        mesa.numero = '01';
        mesa.pedidos.push(pedido);
        mesa.pedidos.push(pedido2);
        mesa.emAberto = true;

        this.entitySelected.mesas = [];
        this.entitySelected.mesas.push(mesa);

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
        this.generatTables(entity);

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
        for (let index = 0; index < entity.quantidadeDeMesas; index++) {
            let newTable = new Tables();
            newTable.numero = "Mesa: " + index;
            entity.mesas.push(newTable);
        }
    }

    getTableByNumber(numero: string) {
        if (this.entitySelected.mesas) {
            this.tableSelected = this.entitySelected.mesas
                .find(c => c.numero == numero);
        }
    }


  getOrderByNumber(pedido: string) {
    if (this.tableSelected.pedidos) {
        this.orderSelected = this.tableSelected.pedidos
            .find(c => c.numeroDoPedido == pedido);
    }
  }

}

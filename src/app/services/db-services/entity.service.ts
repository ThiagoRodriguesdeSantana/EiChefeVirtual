import { PedidoCliente } from './../../models/pedido-cliente';
import { ClosingRequestToForm } from './../../models/closing-request-to-form';
import { AdditionalValues } from './../../models/additional-values';
import { ItemToForm } from './../../models/item-to-form';
import { Tables } from './../../models/Tables';
import { element, promise } from 'protractor';
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
import { v1 } from 'uuid';
import { resolve } from 'url';

@Injectable()
export class EntityService {



    CLIENTES = 'clientes';
    clientesList: AngularFireList<any>;
    orderSelected: Order;
    itemSelected: Item;
    private entity = new BehaviorSubject<Entity>(new Entity());
    entityLoeaded$ = this.entity.asObservable();
    validate: EntityValidate;
    requestClosesList: ClosingRequestToForm[];
    allOrder: Order[];


    entitySelected: Entity;
    entities: AngularFireList<any>;

    constructor(private firebaseDb: AngularFireDatabase,
        private common: CommonService) {
        this.entitySelected = new Entity();
        this.clientesList = this.firebaseDb.list(this.CLIENTES);
        this.validate = EntityValidate.getInstance();
        this.requestClosesList = new Array<ClosingRequestToForm>();
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
                    if (!this.entitySelected.pedidos) {
                        return;
                    }
                    let pedidos = Object.values(this.entitySelected.pedidos);
                    this.getClosingRequest(pedidos)
                    this.entitySelected.pedidos = pedidos.filter(c => c.pedidoEmAberto);
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


    getClosingRequest(orders: Order[]) {
        this.allOrder = orders;

        let request = orders.filter(c => c.solicitacaoDeFechamento.pago == false
            && c.solicitacaoDeFechamento.solicitado)

        if (request && request.length) {


            request.forEach(c => {
                if (c.solicitacaoDeFechamento) {

                    let close = new ClosingRequestToForm();
                    close.numeroDoPedido = c.numeroDoPedido;
                    close.estaPago = c.solicitacaoDeFechamento.pago != undefined ? c.solicitacaoDeFechamento.pago : false;
                    close.mesa = c.mesa;
                    close.emailDoCliente = c.emailDoCliente;
                    close.valorTotal = "R$ " + c.solicitacaoDeFechamento.valorTotal.toFixed(2).replace(".", ",");
                    this.requestClosesList.push(close);
                    console.log(this.requestClosesList);
                }
            })
        } else {
            this.requestClosesList = [];
        }
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
        if (entity.logo == '' || entity.logo == null) {
            entity.logo = 'gs://comandavirtual-15db8.appspot.com/undefined/help-web-button.png'
        }
        if (entity.$key == null) {
            return this.insertEntity(entity);
        } else {
            return this.alterEntity(entity);
        }
    }

    finalizeItem(item: ItemToForm) {

        for (let i = 0; i < this.orderSelected.itens.length; i++) {
            if (this.orderSelected.itens[i].item.codigo == item.codItem) {
                this.orderSelected.itens[i].antendido = item.finalized;
            }
        }
        this.alterOrderSelected();

    }
    private alterOrderSelected() {
        let path = 'empresas/' + this.entitySelected.$key + '/pedidos/' + this.orderSelected.numeroDoPedido;
        this.firebaseDb.object(path).set({ ...this.orderSelected });
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
            quantidadeDeMesas: entity.quantidadeDeMesas,
            valoresAdicionais: this.obterValoresAdicionais(entity.valoresAdicionais)
        });

        this.saveUser(entity.login.email);

    }

    obterValoresAdicionais(adicionais: AdditionalValues[]): AdditionalValues[] {
        return adicionais != null ? adicionais : new Array<AdditionalValues>();
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

    finalizeOrder() {

        this.orderSelected.itens.forEach(item => {
            if (!item.antendido) {
                throw new Error("Ainda existem itens que não foram atendidos,"
                    + "você precisa atendelos antes de finalizar o pedido.");
            }
        });
        this.orderSelected.pedidoEmAberto = false;
        this.alterOrderSelected();
    }




    saveAdditional(additional: AdditionalValues) {
        if (!additional.id) {
            additional.id = v1()
            if (!this.entitySelected.valoresAdicionais) {
                this.entitySelected.valoresAdicionais = [];
            }
            this.entitySelected.valoresAdicionais.push(additional)
        } else {
            for (let i = 0; i < this.entitySelected.valoresAdicionais.length; i++) {
                if (this.entitySelected.valoresAdicionais[i].id == additional.id) {
                    this.entitySelected.valoresAdicionais[i] = additional;
                }
            }
        }

        this.saveEntity(this.entitySelected);
    }

    payment(close: ClosingRequestToForm) {

        this.allOrder.forEach(pedido => {

            if (pedido.numeroDoPedido == close.numeroDoPedido) {
                pedido.solicitacaoDeFechamento.pago = true;
                this.alterarPedido(pedido);
                this.alterarPedidoNoCliente(pedido);
            }

        });
    }

    alterarPedidoNoCliente(pedido: Order) {

        let list = [];

        this.firebaseDb.database

            .ref(this.CLIENTES)
            .orderByChild('usuario')
            .equalTo(pedido.emailDoCliente).on("child_added", (snapshot) => {
                let item = snapshot.val();
                item.$key = snapshot.key;
                list.push(item);

                this.alterarStatusDoUsuario(list, pedido);

            });
    }

    private alterarStatusDoUsuario(list: any[], pedido: Order) {
        let pedidoCliente = new PedidoCliente();
        let chave = list[0].$key;
        pedidoCliente.dataPedido = new Date();
        pedidoCliente.empresa = this.entitySelected.$key;
        pedidoCliente.numero = pedido.numeroDoPedido;
        pedidoCliente.status = false;
        let path = this.CLIENTES + '/' + chave + '/pedidos/' + pedido.numeroDoPedido + '/';
        this.firebaseDb.object(path).set({ ...pedidoCliente });
    }

    private alterarPedido(pedido: Order) {
        let path = 'empresas/' + this.entitySelected.$key + '/pedidos/' + pedido.numeroDoPedido + '/solicitacaoDeFechamento/';
        this.firebaseDb.object(path).set({ ...pedido.solicitacaoDeFechamento });
    }
}

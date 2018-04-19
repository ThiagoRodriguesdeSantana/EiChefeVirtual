import { Order } from './order';
import { Login } from "./login";
import { Item } from "./item";
import { Tables } from './Tables';

export class Entity {
    constructor() {
        this.telefones = new Array;
        this.itens = new Array<Item>();
        this.login = new Login();
    }

    $key: string;
    cnpj: string;
    razaoSocial: string;
    nomeDoResponsavel: string;
    cpfDoResponsavel: string;
    cep: string;
    rua: string;
    bairro: string;
    complemento: string;
    cidade: string;
    estado: string;
    telefones: string[]
    login: Login;
    logo: string;
    itens:Item[];
    quantidadeDeMesas:number;
    mesas:Tables[];

    copyTo(entity: Entity) {
        
        this.$key = entity.$key;
        this.cnpj = entity.cnpj;
        this.razaoSocial = entity.razaoSocial;
        this.nomeDoResponsavel = entity.nomeDoResponsavel;
        this.cpfDoResponsavel = entity.cpfDoResponsavel;
        this.cep = entity.cep;
        this.rua = entity.rua;
        this.bairro = entity.bairro;
        this.complemento = entity.complemento;
        this.cidade = entity.cidade;
        this.estado = entity.estado;
        this.telefones = entity.telefones;
        this.login.email = entity.login.email;
        this.login.password = entity.login.password;
        this.logo = entity.logo;
        this.itens = entity.itens;
        this.quantidadeDeMesas = entity.quantidadeDeMesas;

        return this;

    }
}

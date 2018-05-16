import { Item } from "./item";
import { ItemOrder } from "./itemOrder";
import { SolicitacaoDeFechamento } from "./solicitacao-de-fechamento";

export class Order {

    numeroDoPedido: string;
    itens: ItemOrder[];
    pedidoEmAberto: boolean;
    emailDoCliente: string;
    horaDoPedido: Date;
    mesa:string;
    solicitacaoDeFechamento: SolicitacaoDeFechamento;
}

import { Item } from "./item";
import { ItemOrder } from "./itemOrder";

export class Order {

    numeroDoPedido: string;
    itens: ItemOrder[];
    pedidoEmAberto: boolean;
    emailDoCliente: string;
    horaDoPedido: Date;
    mesa:string;
}

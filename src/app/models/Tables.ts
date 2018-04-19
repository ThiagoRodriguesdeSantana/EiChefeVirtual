import { Order } from './order';
export class Tables {
    /**
     *
     */
    constructor() {
        this.pedidos = new Array<Order>();
        
    }
    numero:string;
    pedidos:Order[]
}


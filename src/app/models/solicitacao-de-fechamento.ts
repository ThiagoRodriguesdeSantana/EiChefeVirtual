import { Adicionais } from "./adicionais";

export class SolicitacaoDeFechamento {
    constructor() {
        this.adicionais = [];
        
    }

    formaDePagamento: string;
    pagarDezPorcento: boolean;
    valorTotal: number;
    valorTotalAdicionais: number;
    adicionais: Adicionais[];
    pago: boolean;
}

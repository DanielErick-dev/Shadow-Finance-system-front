export type Ativo = {
    id: number;
    codigo: string;
    tipo: 'FII' | 'ACAO' | 'ETF' | 'BDR';
};

export type ItemDividendo = {
    id: number;
    ativo: Ativo;
    valor: number;
    data: string;
};

export type DividendoMes = {
    id: number;
    mes: number;
    ano: number;
    itens: ItemDividendo[]
};
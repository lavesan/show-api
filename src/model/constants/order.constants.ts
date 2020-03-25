enum OrderType {
    MONEY = 0,
    CREDIT = 1,
    DEBIT = 2,
}

enum OrderStatus {
    TO_FINISH = 0,
    MADE = 1,
    PREPARING = 2,
    SENDING = 3,
    SENDED = 4,
    DONE = 5,
    CANCELED = 6,
}

enum OrderUserWhoDeleted {
    BACKOFFICE = 0,
    CLIENT = 1,
}

const priceByDistrict = {
    boaViagem: 6,
    pina: 6,
    setubal: 6,
    afogados: 6,
    madalena: 6,
    boaVista: 6,
    ipsep: 6,
    imbiribeira: 6,
    arruda: 9,
    derby: 9,
    graças: 9,
    bairroDoRecife: 9,
    espinheiro: 9,
    rosarinho: 9,
    ibura: 9,
    caçote: 9,
    areias: 9,
    jordaoDeRecife: 9,
    bongi: 9,
    jardimSaoPaulo: 12,
    torre: 12,
    varzea: 12,
    caxanga: 12,
    macaxeira: 12,
    novaDescoberta: 12,
    casaAmarela: 12,
    doisIrmaos: 12,
    cajueiro: 12,
    piedade: 12,
    candeias: 12,
    santaTereza: 12,
    bairroNovo: 12,
    hipodromo: 12,
}

export { OrderType, OrderStatus, OrderUserWhoDeleted, priceByDistrict }
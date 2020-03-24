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

export { OrderType, OrderStatus, OrderUserWhoDeleted }
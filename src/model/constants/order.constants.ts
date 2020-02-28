enum OrderType {
    MONEY = 0,
    CREDIT = 1,
    DEBIT = 2,
}

enum OrderStatus {
    MADE = 0,
    PREPARING = 1,
    SENDING = 2,
    SENDED = 3,
    DONE = 4,
    CANCELED = 5,
    WAITING_APPROVAL = 6,
}

enum OrderUserWhoDeleted {
    BACKOFFICE = 0,
    CLIENT = 1,
}

export { OrderType, OrderStatus, OrderUserWhoDeleted }
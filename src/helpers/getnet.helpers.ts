export const getnetOrderId = (id: number | string, timestampCreationDate: string) => {
    return `zero_veneno_order_${id}_${timestampCreationDate}`;
}

export const getnetUserId = (id: number | string) => {
    return `zero_veneno_user_${id}`;
}

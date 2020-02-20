export const onlyNumberStringToFloatNumber = (numberString: string): number => {
    return Number(numberString.replace(/(\d{2})$/, '.$1'));
}

export const floatNumberToOnlyNumberString = (floatNumber: number): string => {
    return floatNumber.toFixed(2).toString().replace(/\D/, '');
}

export const numberStringToReal = (valueCents: string): string => {
    return `R$ ${onlyNumberStringToFloatNumber(valueCents).toString().replace('.', ',')}`;
}

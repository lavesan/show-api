export const onlyNumberStringToFloatNumber = (numberString: string) => {
    return Number(numberString.replace(/(\d{2})$/, '.$1'));
}

export const floatNumberToOnlyNumberString = (floatNumber: number) => {
    return floatNumber.toFixed(2).toString().replace(/\D/, '');
}

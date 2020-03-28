
export const unmaskDistrictName = (value: string): string => {

    const [firstLetter, ...valor] = value;
    const firstLetterLower = firstLetter.toLowerCase();
    const parsedValue = `${firstLetterLower}${valor.join('')}`;

    return parsedValue.replace(/ ([A-Z])/g, '$1');

}
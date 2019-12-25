import { Like } from 'typeorm';

export interface IPaginateResponseType<Data> {
    data: Data[];
    resultsCount: number;
    allResultsCount: number;
    page: number;
}

interface IPaginateResponseParam {
    data: any[];
    allResultsCount: number;
    page: number;
}

export const skipFromPage = (page: number) => (page - 1) * 10;

export const paginateResponseSchema = ({ data, allResultsCount, page }: IPaginateResponseParam) =>
    ({
        data,
        resultsCount: data.length,
        allResultsCount,
        page,
    });

interface IFieldsFilter {
    like?: string[];
    equal?: string[];
    data: { [key: string]: any };
}

export const addFilter = ({ like = [], equal = [], data }: IFieldsFilter) => {
    const filter: any = {};
    const entries = Object.entries(data);

    entries.forEach(([key, value]) => {

        if (typeof value === 'object') {
            filter[key] = addFilter({ like, equal, data: value });
        } else if (like.includes(key)) {
            filter[key] = Like(value);
        } else if (equal.includes(key)) {
            filter[key] = value;
        }

    });

    return filter;
}

export enum Code {
    OK = 1,
    NOT_FOUND = 2,
    SELL_ERROR = 3,
}
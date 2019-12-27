import { Like, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Between } from 'typeorm';
import { FilterForm } from 'src/model/forms/FilterForm';

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

interface IFieldsGenerateFilter {
    like?: string[];
    equal?: string[];
    datas: FilterForm[];
}

const searchType = {
    between() {

    }
}

export const generateFilter = ({ like = [], equal = [], datas }: IFieldsGenerateFilter) => {

    const filter: any = {};

    datas.forEach(({ field, value, type }) => {

        if (type === 'lessThan') {

            filter[field] = LessThan(value);

        } else if (type === 'lessThanOrEqual') {

            filter[field] = LessThanOrEqual(value);

        } else if (type === 'moreThan') {

            filter[field] = MoreThan(value);

        } else if (type === 'moreThanOrEqual') {

            filter[field] = MoreThanOrEqual(value);

        } else if (type === 'between') {

            const [value1, value2] = datas.filter(data => data.field === field).map(data => data.value);
            filter[field] = Between(value1, value2);

        } else if (like.includes(field)) {

            filter[field] = Like(value);

        } else if (equal.includes(field)) {

            filter[field] = value;

        }
    })

    return filter;

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
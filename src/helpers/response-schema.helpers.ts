import { SelectQueryBuilder } from 'typeorm';
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
    limit: number;
}

export const skipFromPage = (page: number) => (page - 1) * 10;

export const paginateResponseSchema = ({ data, allResultsCount, page, limit }: IPaginateResponseParam) =>
    ({
        data,
        resultsCount: data.length,
        allResultsCount,
        allPages: Math.floor(allResultsCount / limit) + 1,
        page,
    });

interface IFieldsFilter {
    like?: string[];
    equal?: string[];
    data: { [key: string]: any };
}

interface IFieldsGenerateFilter {
    like?: string[];
    numbers?: string[];
    equalStrings?: string[];
    valueCentsNumbers?: string[];
    datas: FilterForm[];
}

interface IGenerateQuerybuilder extends IFieldsGenerateFilter {
    builder: SelectQueryBuilder<any>;
}

export const generateQueryFilter = ({
    like = [],
    numbers = [],
    equalStrings = [],
    valueCentsNumbers = [],
    datas,
    builder,
}: IGenerateQuerybuilder): SelectQueryBuilder<any> => {

    datas.forEach(({ field, value, type }) => {

        if (type === 'all') {

            const onlyNumber = value.toString().replace(/\D/g, '');

            like.forEach(name => {
                builder.orWhere(`${name} ILIKE '%${value}%'`);
            });

            equalStrings.forEach(name => {
                builder.orWhere(`${name} = :column`, { column: value });
            });

            if (onlyNumber) {
                numbers.forEach(name => {
                    builder.orWhere(`${name} = :column`, { column: onlyNumber });
                });

                valueCentsNumbers.forEach(name => {
                    builder.orWhere(`${name} = :column`, { column: onlyNumber });
                });
            }

        }

        if (type === 'lessThan') {

            builder.where(`${field} < :column`, { column: value });

        } else if (type === 'lessThanOrEqual') {

            builder.where(`${field} <= :column`, { column: value });

        } else if (type === 'moreThan') {

            builder.where(`${field} > :column`, { column: value });

        } else if (type === 'moreThanOrEqual') {

            builder.where(`${field} >= :column`, { column: value });

        } else if (type === 'between') {

            if (typeof value === 'object') {
                if (valueCentsNumbers.includes(field)) {
                    builder.where(`${field} >= to_char(float8 :column, 'FM999999999.00')`, { column: value.from });
                    builder.where(`${field} <= to_char(float8 :column, 'FM999999999.00')`, { column: value.to });
                } else {
                    builder.where(`${field} >= :column`, { column: value.from });
                    builder.where(`${field} <= :column`, { column: value.to });
                }

            }

        } else if (type === 'contains') {

            builder.where(`${field} ILIKE '%${value}%'`);

        } else if (type === 'equals') {

            builder.where(`${field} = :value`, { value });

        } else if (like.includes(field)) {

            builder.where(`${field} ILIKE '%${value}%'`, { column: value });

        } else if (numbers.includes(field)) {

            const onlyNumber = value.toString().replace(/\D/g, '');
            builder.where(`${field} = :column`, { column: onlyNumber });

        } else if (equalStrings.includes(field)) {

            builder.where(`${field} = :column`, { column: value });

        }
    });

    return builder;

}

// export const generateFilter = ({ like = [], numbers = [], equalStrings = [], datas }: IFieldsGenerateFilter) => {

//     const filter: any = {};

//     datas.forEach(({ field, value, type }) => {

//         if (type === 'all') {

//             const onlyNumber = value.toString().replace(/\D/g, '');

//             like.forEach(name => {
//                 filter[name] = Like(value);
//             });

//             equalStrings.forEach(name => {
//                 filter[name] = value;
//             });

//             if (onlyNumber) {
//                 numbers.forEach(name => {
//                     filter[name] = onlyNumber;
//                 });
//             }

//         }

//         if (type === 'lessThan') {

//             filter[field] = LessThan(value);

//         } else if (type === 'lessThanOrEqual') {

//             filter[field] = LessThanOrEqual(value);

//         } else if (type === 'moreThan') {

//             filter[field] = MoreThan(value);

//         } else if (type === 'moreThanOrEqual') {

//             filter[field] = MoreThanOrEqual(value);

//         } else if (type === 'between') {

//             // TODO: Adicionar um Between de datas
//             const [value1, value2] = datas.filter(data => data.field === field).map(data => data.value);
//             filter[field] = Between(value1, value2);

//         } else if (like.includes(field)) {

//             filter[field] = Raw(alias => `${alias} ILIKE '%${value}%'`);

//         } else if (numbers.includes(field)) {

//             const onlyNumber = value.toString().replace(/\D/g, '');
//             filter[field] = onlyNumber;

//         } else if (equalStrings.includes(field)) {

//             filter[field] = value;

//         }
//     });

//     return filter;

// }

// export const addFilter = ({ like = [], equal = [], data }: IFieldsFilter) => {
//     const filter: any = {};
//     const entries = Object.entries(data);

//     entries.forEach(([key, value]) => {

//         if (typeof value === 'object') {
//             filter[key] = addFilter({ like, equal, data: value });
//         } else if (like.includes(key)) {
//             filter[key] = Like(value);
//         } else if (equal.includes(key)) {
//             filter[key] = value;
//         }

//     });

//     return filter;
// }

export enum Code {
    OK = 1,
    NOT_FOUND = 2,
    SELL_ERROR = 3,
}
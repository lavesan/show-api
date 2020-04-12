import { SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';

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

interface ISucessResParams {
    data: any;
    opts?: any;
}

export const successRes = ({ data, opts = {} }: ISucessResParams) => ({
    data,
    ...opts,
})

interface IFailResParams {
    code: number;
    message: string;
}

export const failRes = ({ code, message }: IFailResParams) => ({ code, message });

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
    dates?: string[];
    numbersArray?: string[];
    inValues?: string[];
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
    dates = [],
    numbersArray = [],
    inValues = [],
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

            if (dates.includes(field)) {

                // @ts-ignore
                const momentDate = moment(value);

                const startDay = momentDate.startOf('day').toDate();
                builder.where(`${field} < :column`, { column: startDay });

            } else if (valueCentsNumbers.includes(field)) {
                builder.where(`${field}::INTEGER < :column`, { column: Number(value) });
            } else {
                builder.where(`${field} < :column`, { column: value });
            }

        } else if (type === 'lessThanOrEqual') {

            if (dates.includes(field)) {

                // @ts-ignore
                const momentDate = moment(value);

                const endDay = momentDate.endOf('day').toDate();
                builder.where(`${field} <= :column`, { column: endDay });

            } else if (valueCentsNumbers.includes(field)) {
                builder.where(`${field}::INTEGER <= :column`, { column: Number(value) });
            } else {
                builder.where(`${field} <= :column`, { column: value });
            }

        } else if (type === 'moreThan') {

            if (dates.includes(field)) {

                // @ts-ignore
                const momentDate = moment(value);

                const endDay = momentDate.endOf('day').toDate();
                builder.where(`${field} > :column`, { column: endDay });

            } else if (valueCentsNumbers.includes(field)) {
                builder.where(`${field}::INTEGER > :column`, { column: Number(value) });
            } else {
                builder.where(`${field} > :column`, { column: value });
            }

        } else if (type === 'moreThanOrEqual') {

            if (dates.includes(field)) {

                // @ts-ignore
                const momentDate = moment(value);

                const startDay = momentDate.startOf('day').toDate();
                builder.where(`${field} >= :column`, { column: startDay });

            } else if (valueCentsNumbers.includes(field)) {
                builder.where(`${field}::INTEGER >= :column`, { column: Number(value) });
            } else {
                builder.where(`${field} >= :column`, { column: value });
            }

        } else if (type === 'between') {

            if (typeof value === 'object') {
                if (valueCentsNumbers.includes(field)) {
                    builder.where(`${field}::INTEGER BETWEEN :from AND :to`, { from: Number(value.from), to: Number(value.to) });
                } else if (dates.includes(field)) {

                    const fromMomentDate = moment(value.from);
                    const toMomentDate = moment(value.to);

                    const startDay = fromMomentDate.startOf('day').toDate();
                    const endDay = toMomentDate.endOf('day').toDate();

                    builder.where(`${field} BETWEEN :startDay AND :endDay`, { startDay, endDay });

                } else {
                    builder.where(`${field} BETWEEN :from AND :to`, { from: value.from, to: value.to });
                }

            }

        } else if (type === 'contains') {

            builder.where(`${field} ILIKE '%${value}%'`);

        } else if (type === 'equals') {

            if (inValues.includes(field)) {
                builder.where(`${field} IN (:...value)`, { value });
            } else if (dates.includes(field)) {

                // @ts-ignore
                const momentDate = moment(value);

                const startDay = momentDate.startOf('day').toDate();
                const endDay = momentDate.endOf('day').toDate();

                builder.where(`${field} BETWEEN :startDay AND :endDay`, { startDay, endDay });

            } else if (numbersArray.includes(field)) {
                builder.where(`${field} @> :value::INTEGER[]`, { value: [value] });
            } else {
                builder.where(`${field} = :value`, { value });
            }

        } else if (type === 'notEquals') {

            builder.where(`${field} != ${value}`, { column: value });

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

export enum Code {
    OK = 1,
    NOT_FOUND = 2,
    SELL_ERROR = 3,
    NOT_AUTHORIZED = 4,
}
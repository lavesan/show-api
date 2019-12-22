export type PaginateResponseType<Data> = {
    data: Data[];
    resultsCount: number;
    allResultsCount: number;
    page: number;
}

export const paginateResponseSchema = (data: any[], allResultsCount: number, page: number) =>
    ({
        data,
        resultsCount: data.length,
        allResultsCount,
        page,
    });
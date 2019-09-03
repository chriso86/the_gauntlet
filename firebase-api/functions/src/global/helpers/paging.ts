import {PAGING} from "../constants";

export const calculatePagingStart = (pageSize: number | string, pageNo: number | string): number => {
    let mutatedPageNo = pageNo;
    let mutatedPageSize = pageSize;

    if (typeof mutatedPageNo !== 'number') {
        mutatedPageNo = parseInt(mutatedPageNo);

        if (isNaN(mutatedPageNo) || !isFinite(mutatedPageNo)) {
            mutatedPageNo = PAGING.firstPageDefault;
        }
    }

    if (typeof mutatedPageSize !== 'number') {
        mutatedPageSize = parseInt(mutatedPageSize);

        if (isNaN(mutatedPageSize) || !isFinite(mutatedPageSize)) {
            mutatedPageSize = PAGING.pageSize;
        }
    }

    const upperPageItemNo = (mutatedPageNo * mutatedPageSize);
    const itemNoOffset = mutatedPageNo === PAGING.firstPageDefault
        ? mutatedPageSize
        : (mutatedPageSize - 1);

    return upperPageItemNo - itemNoOffset;
};

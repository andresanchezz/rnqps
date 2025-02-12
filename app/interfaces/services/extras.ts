export interface Extras {
    data: Datum[];
    meta: Meta;
}

export interface Datum {
    id:         string;
    item:       string;
    itemPrice:  number;
    commission: string;
    createdAt:  Date;
    updatedAt:  Date;
}

export interface Meta {
    page:            number;
    take:            number;
    totalCount:      number;
    pageCount:       number;
    hasPreviousPage: boolean;
    hasNextPage:     boolean;
}

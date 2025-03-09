export interface CleaningTypes {
    data: Type[];
    meta: Meta;
}

export interface Type {
    id:           string;
    description:  Description;
    cleaningType: CleaningType;
    price:        number;
    commission:   string;
    communityId:  string;
    createdAt:    Date;
    updatedAt:    Date;
    community:    Community;
}

export enum CleaningType {
    DeepClean = "Deep Clean",
    TouchUpClean = "TouchUp Clean",
    TouchupClean = "Touchup Clean",
}

export interface Community {
    id:            string;
    communityName: CommunityName;
}

export enum CommunityName {
    PrimeLuxuryApartments = "Prime Luxury Apartments",
    ZenApartments = "Zen Apartments",
}

export enum Description {
    The1X1Bedroom = "1x1 Bedroom",
    The2X2Bedroom = "2X2 Bedroom",
    The3X2Bedroom = "3x2 Bedroom",
}

export interface Meta {
    page:            number;
    take:            number;
    totalCount:      number;
    pageCount:       number;
    hasPreviousPage: boolean;
    hasNextPage:     boolean;
}

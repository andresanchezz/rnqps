export interface Communities {
    data: Community[];
    meta: Meta;
}

export interface Community {
    id:            string;
    communityName: string;
    createdAt:     Date;
    updatedAt:     Date;
    user:          User;
    company:       Company;
}

export interface Company {
    id:          string;
    companyName: CompanyName;
}

export enum CompanyName {
    GreystarManagementServices = "Greystar Management Services",
    PantherResidentialManagement = "Panther Residential Management",
    VenterraRealty = "Venterra Realty",
}

export interface User {
    id:          string;
    name:        string;
    email:       string;
    phoneNumber: string;
    role:        Role;
}

export interface Role {
    id:   string;
    name: Name;
}

export enum Name {
    Manager = "Manager",
}

export interface Meta {
    page:            number;
    take:            number;
    totalCount:      number;
    pageCount:       number;
    hasPreviousPage: boolean;
    hasNextPage:     boolean;
}

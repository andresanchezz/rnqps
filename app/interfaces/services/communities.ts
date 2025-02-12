export interface CommunitiesByManager {
    id: string;
    communityName: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    company: Company;
}

export interface Company {
    id: string;
    companyName: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: Role;
}

export interface Role {
    id: string;
    name: string;
}



// export interface Communities {
//     data: Datum[];
//     meta: Meta;
// }

// export interface Datum {
//     id:            string;
//     communityName: string;
//     createdAt:     Date;
//     updatedAt:     Date;
//     user:          User;
//     company:       Company;
// }

// export interface Company {
//     id:          string;
//     companyName: string;
// }


// export interface User {
//     id:          string;
//     name:        string;
//     email:       string;
//     phoneNumber: string;
//     role:        Role;
// }

// export interface Role {
//     id:   string;
//     name: Name;
// }

// export enum Name {
//     Cleaner = "Cleaner",
//     Manager = "Manager",
// }

// export interface Meta {
//     page:            number;
//     take:            number;
//     totalCount:      number;
//     pageCount:       number;
//     hasPreviousPage: boolean;
//     hasNextPage:     boolean;
// }

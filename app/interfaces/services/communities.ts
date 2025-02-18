export interface Communities {
    id:            string;
    communityName: string;
    createdAt:     Date;
    updatedAt:     Date;
    user:          User;
    company:       Company;
}

export interface Company {
    id:          string;
    companyName: string;
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
    name: string;
}

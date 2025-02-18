import { Meta } from "../meta.interface";

export interface User {
    data: AUser[];
    meta: Meta;
}

export interface AUser {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    roleId: string;
    createdAt: Date;
    role: Role;
}

export interface Role {
    id: string;
    name: string;
}



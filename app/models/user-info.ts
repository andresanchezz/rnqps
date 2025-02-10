export interface UserInfo {
    createdAt:   string;
    email:       string;
    id:          string;
    name:        string;
    phoneNumber: string;
    role:        Role;
    roleId:      string;
}

export interface Role {
    id:   string;
    name: string;
}
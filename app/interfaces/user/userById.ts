export interface UserById {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    roleId: string;
    createdAt: string;
    role: Role;
  }

  interface Role {
    id: string;
    name: string;
  }
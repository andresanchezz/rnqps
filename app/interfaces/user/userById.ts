import { Meta } from "../meta.interface";

export interface Cleaner {
  data: DataCleaner[];
  meta: Meta
}

export interface DataCleaner {
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
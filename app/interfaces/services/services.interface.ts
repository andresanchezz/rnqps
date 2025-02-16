import { Meta } from "../meta.interface";

export interface Services {
    data: Service[];
    meta: Meta;
}

export interface Service {
    id: string;
    date: string;
    schedule: null;
    comment: null | string;
    userComment: null | string;
    unitySize: string;
    unitNumber: string;
    communityId: string;
    typeId: string;
    statusId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    community: Community;
    type: Type;
    status: Status;
}

export interface FilteredServices {
    created: Service[];
    pending: Service[];
    approved: Service[];
    rejected: Service[];
    completed: Service[];
    finished: Service[];
  }

export interface Community {
    id: string;
    communityName: string;
    userId: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Status {
    id: string;
    statusName: string;
    createdAt: string;
    updatedAt: string;
}

export interface Type {
    id: string;
    description: string;
    cleaningType: string;
    price: number;
    commission: string;
    communityId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceByStatusId {
    all: Services;
    created: Services;
    pending: Services;
    approved: Services;
    rejected: Services;
    completed: Services;
    finished: Services;
}
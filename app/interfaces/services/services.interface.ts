import { Meta } from "../meta.interface";

export interface Service {
    data: DataService[];
    meta: Meta;
}

export interface DataService {
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
    created: Service;
    pending: Service;
    approved: Service;
    rejected: Service;
    completed: Service;
    finished: Service;
}


export type ServiceStatus = 'created' | 'pending' | 'approved' | 'rejected' | 'completed' | 'finished'; 


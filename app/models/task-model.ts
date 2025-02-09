export interface Task {
  id:          string;
  date:        Date;
  schedule:    null;
  comment:     null;
  userComment: null;
  unitySize:   string;
  unitNumber:  string;
  communityId: string;
  typeId:      string;
  statusId:    string;
  userId:      string | null;
  createdAt:   Date;
  updatedAt:   Date;
  community:   Community | null;
  type:        Type | null;
  status:      Status | null;
}

export interface Community {
  id:            string;
  communityName: string;
  userId:        string;
  companyId:     string;
  createdAt:     Date;
  updatedAt:     Date;
}

export interface Status {
  id:         string;
  statusName: string;
  createdAt:  Date;
  updatedAt:  Date;
}

export interface Type {
  id:           string;
  description:  string;
  cleaningType: string;
  price:        number;
  commission:   string;
  communityId:  string;
  createdAt:    Date;
  updatedAt:    Date;
}
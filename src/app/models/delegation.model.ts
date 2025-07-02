export interface DelegatedUser {
  id: number;
  fromLoginId: string;
  toLoginId: string;
  fromUserName: string;
  toUserName: string;
  delegationFrom: string; 
  delegationTo: string;
  delegateFrom: string;
  active: boolean;
  deleted: boolean;
  delegationReason: string;
  createDate: string;
  addedByUserName: string;
}

export interface UserLookup {
  loginId: number | string;
  userName: string;
  directorateName: string;
  department: string;
  designation: string;
}

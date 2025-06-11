import { StaffMemebr } from "./staff-member.model";

export interface Department {
  directorateName: string;
  departmentCode: number;
  tls: StaffMemebr[];
  engs: StaffMemebr[];
}

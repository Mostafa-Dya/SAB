import { Person } from './shared/person.model';

export interface SabMember extends Person {
  departmentName: string;
  departmentCode: number;
  directorateName: string;
  directorateCode: number;
}

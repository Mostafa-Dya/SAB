import { Person } from './shared/person.model';

export interface Manager extends Person {
  departmentName: string;
  departmentCode: number;
  directorateName: string;
  directorateCode: number;
}

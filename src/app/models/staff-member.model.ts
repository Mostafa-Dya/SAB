import { Person } from './shared/person.model';

export interface StaffMemebr extends Person {
  departmentName: string;
  departmentCode: number;
  divisionCode: number;
  directorateName: string;
}

import { Manager } from './manager.model';
import { StaffMemebr } from './staff-member.model';

export class Department {	   
	directorateName: string;
	departmentCode:number;
	tls:StaffMemebr[];
	engs:StaffMemebr[];	
}

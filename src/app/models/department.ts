import { Manager } from "./manager";
import { StaffMemebr } from "./staff-member";

export class Department {	   
	directorateName: string;
	departmentCode:number;
	tls:StaffMemebr[];
	engs:StaffMemebr[];	
}

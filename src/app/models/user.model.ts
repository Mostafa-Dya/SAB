import { Employee } from './employee.model'
import { SabMember } from './sab-member.model';
export class User {
	// admin(arg0: string, admin: any) {
	// 	throw new Error('Method not implemented.');
	// }
	//userFullName: string = "";
	// userDelegations:any[];
	//userLogin: string = "";
	//delegateFor: string[] = [];
	inboxCount: number = 0;
	responseInprogCount: number = 0;
	//	empDetails: Employee =new Employee() ;   
	sabMember: SabMember;
	admin: boolean;
}


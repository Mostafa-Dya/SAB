
import { SabMember } from './sab-member.model';
export class CommitteeUsers {	

	directorateName: string;
	departmentCode:number;
	committeeHeadManagers:SabMember[];
	committeeHeadTls:SabMember[];
	committeeHeadDCEOs:SabMember[];
	committeeHeadCEOs:SabMember[];
	formatterDCEOs:SabMember[];
	formatterCEOs:SabMember[];
}

import { Comment } from "./comment.model";
import { History } from "./history.model";

export class WorkItem{
  obsTitle: string;
  obsSeq: number;
  obsId:string;
  reportCycle:string;
  deptCycleId:string;
  receievedDate: string;
  reportName: string;
  deptName: string;
  status: string;
  callDate:string;
  observation: string;
  noOfActiveDepts: number;
  activeAssignments: number;
  actionComment: string;
  response:string;
  historyList:History[];
  comments:Comment[];
  sendResponseEnabled:boolean=false;
  declineSendBackEnabled:boolean=false;
  assignToDeptEnabled:boolean=false;
  assignToStaffEnabled:boolean=false;
  sendBackEnabled:boolean=false;
  transferDeptEnabled:boolean=false;
  respondOnBehalf:boolean=false;
  approveEnabled:boolean=false;
  assignToExecutiveEnabled:boolean=false;
  assignToComitteeEnabled:boolean=false;
  sendToCEOEnabled:boolean=false;
  approveAndCombineEnabled:boolean=false;
}

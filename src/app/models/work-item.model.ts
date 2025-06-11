import { BasicObservation } from './shared/basic-observation.model';
import { History } from './history.model';
import { Comment } from './comment.model';

export interface WorkItem extends BasicObservation {
  reportCycle: string;
  deptCycleId: string;
  status: string;
  callDate: string;
  observation: string;
  noOfActiveDepts: number;
  activeAssignments: number;
  actionComment: string;
  response: string;
  historyList: History[];
  comments: Comment[];
  sendResponseEnabled: boolean;
  declineSendBackEnabled: boolean;
  assignToDeptEnabled: boolean;
  assignToStaffEnabled: boolean;
  sendBackEnabled: boolean;
  transferDeptEnabled: boolean;
  respondOnBehalf: boolean;
  approveEnabled: boolean;
  assignToExecutiveEnabled: boolean;
  assignToComitteeEnabled: boolean;
  sendToCEOEnabled: boolean;
  approveAndCombineEnabled: boolean;
}

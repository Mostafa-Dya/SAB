import { SabMember } from './sab-member.model';

export interface User {
  inboxCount: number;
  responseInprogCount: number;
  sabMember: SabMember;
  admin: boolean;
}

import { BaseAction } from "./shared/base-action.model";

export interface Comment extends BaseAction {
  sender: string;
  sentTo: string;
  comment: string;
  commentDate: string;
}

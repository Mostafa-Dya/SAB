import { BaseAction } from "./shared/base-action.model";

export interface History extends BaseAction {
  from: string;
  to: string;
  historyDate: string;
}

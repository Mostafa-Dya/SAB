import { BasicObservation } from './shared/basic-observation.model';

export interface InboxItem extends BasicObservation {
  isSelected: boolean;
  responseStatus: string;
  stepCustomId: string;
}

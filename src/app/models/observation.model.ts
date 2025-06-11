import { BasicObservation } from './shared/basic-observation.model';

export interface Observation extends BasicObservation {
  responseStatus: string;
}

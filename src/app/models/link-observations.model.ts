import { ObservationCard } from './observation-card.model';

export interface LinkObservations {
  observationsPending: number;
  finalObs: ObservationCard;
  initialObs: ObservationCard;
}

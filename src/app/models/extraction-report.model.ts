import { ObservationCard } from './observation-card.model';

export class ExtractionReport {
  firstObsTitle: string;
  firstObsType: string;
  firstObsContent: string;
  reportToBeGenerated: string;
  observations: ObservationCard[];
}

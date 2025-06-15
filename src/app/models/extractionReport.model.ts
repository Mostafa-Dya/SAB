import { ObservationCard } from "./observationCard.model";

export class ExtractionReport {
  firstObsTitle: string;
  firstObsType: string;
  firstObsContent: string;
  reportToBeGenerated: string;
  observations: ObservationCard[];
}

import { ObservationCard } from "./observation-card.model";

export interface ExtractionReport {
  firstObsTitle: string;
  firstObsType: string;
  firstObsContent: string;
  reportToBeGenerated: string;
  observations: ObservationCard[];
}

import { EurobahnDeparture, EurobahnDisruption } from '../types/index';

export interface TransitDataPort {
  getLiveDepartures(stationId: string): Promise<EurobahnDeparture[]>;
  getDisruptions?(): Promise<EurobahnDisruption[]>;
}

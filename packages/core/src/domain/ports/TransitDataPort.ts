import { EurobahnDeparture, EurobahnDisruption } from '../types/index.js';

export interface TransitDataPort {
  getLiveDepartures(stationId: string): Promise<EurobahnDeparture[]>;
  getDisruptions?(): Promise<EurobahnDisruption[]>;
}

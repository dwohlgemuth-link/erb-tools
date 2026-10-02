import { EurobahnDeparture, EurobahnDisruption } from '../types/index';

export interface TransitDataPort {
  /** Fetch live departures for a specific station */
  getLiveDepartures(stationId: string, limit?: number): Promise<EurobahnDeparture[]>;
  /** Fetch active disruptions affecting the network */
  getDisruptions?(): Promise<EurobahnDisruption[]>;
}

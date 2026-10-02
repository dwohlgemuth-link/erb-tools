import { TransitDeparture, TransitDisruption } from '../types/index.js';

export interface TransitDataPort {
  /** Fetch live departures for a specific station, optionally filtered by operator */
  getLiveDepartures(stationId: string, operator?: string, limit?: number): Promise<TransitDeparture[]>;
  /** Fetch active disruptions, optionally filtered by operator */
  getDisruptions?(operator?: string): Promise<TransitDisruption[]>;
}

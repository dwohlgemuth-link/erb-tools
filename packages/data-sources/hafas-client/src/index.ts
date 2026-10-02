import { createClient } from 'hafas-client';
import { profile as dbProfile } from 'db-hafas';
import { TransitDataPort, EurobahnDeparture, normalizeDeparture } from '@erb-tools/core';

export class DBHafasAdapter implements TransitDataPort {
  private client: any;

  constructor(userAgent = 'erb-tools-agent') {
    this.client = createClient(dbProfile, userAgent);
  }

  async getLiveDepartures(stationId: string, limit = 10): Promise<EurobahnDeparture[]> {
    const res = await this.client.departures(stationId, { results: limit });
    const departures = res.departures || res;
    
    return departures.map((dep: any) => normalizeDeparture(dep));
  }
}

import { createClient } from 'hafas-client';
import { profile as dbProfile } from 'db-hafas';
import { TransitDataPort, TransitDeparture, normalizeDeparture } from '@erb-tools/core';

export class DBHafasAdapter implements TransitDataPort {
  private client: any;

  constructor(userAgent = 'erb-tools-agent') {
    this.client = createClient(dbProfile, userAgent);
  }

  async getLiveDepartures(stationId: string, operator = 'eurobahn', limit = 10): Promise<TransitDeparture[]> {
    const res = await this.client.departures(stationId, { results: limit });
    const rawDepartures = res.departures || res;
    
    let departures = rawDepartures.map((dep: any) => normalizeDeparture(dep));
    
    if (operator) {
      const lowerOp = operator.toLowerCase();
      departures = departures.filter((d: TransitDeparture) => d.operatorName.toLowerCase().includes(lowerOp));
    }

    return departures;
  }
}

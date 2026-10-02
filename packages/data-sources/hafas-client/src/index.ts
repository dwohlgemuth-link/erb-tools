import { createClient } from 'hafas-client';
import { profile as dbProfile } from 'db-hafas';
import { TransitDataPort, EurobahnDeparture } from '@erb-tools/core';

export class DBHafasAdapter implements TransitDataPort {
  private client: any;

  constructor(userAgent = 'erb-tools-agent') {
    this.client = createClient(dbProfile, userAgent);
  }

  async getLiveDepartures(stationId: string): Promise<EurobahnDeparture[]> {
    const res = await this.client.departures(stationId, { results: 10 });
    const departures = res.departures || res;
    
    return departures.map((dep: any) => {
      const plannedTime = new Date(dep.when || dep.plannedWhen);
      const actualTime = dep.when ? new Date(dep.when) : undefined;
      let delayMinutes = 0;
      
      if (dep.delay != null) {
        delayMinutes = Math.round(dep.delay / 60);
      }

      return {
        tripId: dep.tripId || 'unknown',
        stationId: dep.stop?.id || stationId,
        plannedTime,
        actualTime,
        delayMinutes,
        platform: dep.platform || dep.plannedPlatform || '',
        line: dep.line?.name || '',
        direction: dep.direction || ''
      };
    });
  }
}

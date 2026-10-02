import { createClient } from 'db-vendo-client';
import { profile as dbnavProfile } from 'db-vendo-client/p/dbnav/index.js';
import { TransitDataPort, TransitDeparture } from '@erb-tools/core';

export class DBHafasAdapter implements TransitDataPort {
  private client: any;

  constructor(userAgent = 'erb-tools-tracker-dwohlgemuth-link') {
    this.client = createClient(dbnavProfile, userAgent);
  }

  async getLiveDepartures(stationId: string, operator = 'eurobahn', limit = 10): Promise<TransitDeparture[]> {
    const res = await this.client.departures(stationId, { results: limit * 2 });
    
    // DB Vendo Client returns departures inside 'journeys' or directly as array depending on endpoint,
    // usually client.departures() returns { departures: [...] }
    const rawDepartures = res.departures || res || [];
    
    // Map modern Vendo response to core types
    let departures: TransitDeparture[] = rawDepartures.map((dep: any) => {
      // Vendo typically structures line under dep.line
      const lineName = dep.line?.name || dep.line?.id || '';
      const operatorName = dep.line?.operator?.name || dep.line?.operator || 'DB';
      
      const plannedTime = dep.plannedWhen || dep.when;
      const actualTime = dep.when || dep.plannedWhen;
      const delay = dep.delay || 0;
      
      let status: TransitDeparture['status'] = 'HEALTHY';
      if (dep.cancelled) status = 'CANCELLED';
      else if (dep.line?.productName?.includes('SEV')) status = 'SEV';
      else if (delay > 5) status = 'DELAYED';

      return {
        tripId: dep.tripId || 'unknown',
        stationId: dep.stop?.id || stationId,
        stationName: dep.stop?.name || 'Unknown Station',
        lineName,
        operatorName,
        plannedTime: new Date(plannedTime).toISOString(),
        actualTime: actualTime ? new Date(actualTime).toISOString() : undefined,
        delayInMinutes: delay,
        platform: dep.plannedPlatform || dep.platform || '',
        direction: dep.direction || '',
        status
      };
    });
    
    if (operator) {
      const lowerOp = operator.toLowerCase();
      departures = departures.filter((d: TransitDeparture) => {
        const op = d.operatorName.toLowerCase();
        return op.includes(lowerOp);
      });
    }

    return departures.slice(0, limit);
  }
}

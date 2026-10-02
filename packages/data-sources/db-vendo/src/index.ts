import { createClient } from 'db-vendo-client';
import { profile } from 'db-vendo-client/p/dbweb/index.js';
import { createCachedHafasClient as withCache } from 'cached-hafas-client';
import { createInMemoryStore } from 'cached-hafas-client/stores/in-memory.js';
import { TransitDataPort, TransitDeparture } from '@erb-tools/core';

export class DBVendoAdapter implements TransitDataPort {
  private client: any;

  constructor(userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36') {
    const rawClient = createClient(profile, userAgent);
    this.client = withCache(rawClient, createInMemoryStore());
  }

  async getLiveDepartures(stationId: string, operator = 'eurobahn', limit = 10): Promise<TransitDeparture[]> {
    const res = await this.client.departures(stationId, { duration: 60 });
    
    // DB Vendo Client typically returns departures inside 'departures' or as a raw array.
    const rawDepartures = res.departures || res || [];
    
    // Map modern Vendo response to core types
    let departures: TransitDeparture[] = rawDepartures.map((dep: any) => {
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
        plannedTime: plannedTime ? new Date(plannedTime).toISOString() : new Date().toISOString(),
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

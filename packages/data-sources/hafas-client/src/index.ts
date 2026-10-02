import createHafas from 'db-hafas';
import { TransitDataPort, TransitDeparture, normalizeDeparture } from '@erb-tools/core';

export class DBHafasAdapter implements TransitDataPort {
  private client: any;

  constructor(userAgent = 'erb-tools-tracker-dwohlgemuth-link') {
    this.client = createHafas(userAgent);
  }

  async getLiveDepartures(stationId: string, operator = 'eurobahn', limit = 10): Promise<TransitDeparture[]> {
    const res = await this.client.departures(stationId, { results: limit * 2 }); // fetch more to account for filtering
    const rawDepartures = res.departures || res;
    
    let departures = rawDepartures.map((dep: any) => normalizeDeparture(dep));
    
    if (operator) {
      const lowerOp = operator.toLowerCase();
      departures = departures.filter((d: TransitDeparture) => {
        const op = d.operatorName.toLowerCase();
        return op.includes(lowerOp) || (lowerOp === 'eurobahn' && op === 'erb');
      });
    }

    return departures.slice(0, limit);
  }
}

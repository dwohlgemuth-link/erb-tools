import { TransitDeparture } from '../domain/types/index.js';

/**
 * Normalizes a raw departure object into the strict generalized TransitDeparture schema.
 */
export function normalizeDeparture(raw: any): TransitDeparture {
  const plannedTime = raw.plannedTime || raw.plannedWhen || raw.when;
  const actualTime = raw.actualTime || raw.when || raw.plannedWhen;
  const delayInMinutes = raw.delayInMinutes ?? (raw.delay != null ? Math.round(raw.delay / 60) : 0);
  
  let status: TransitDeparture['status'] = 'HEALTHY';
  if (raw.cancelled) {
    status = 'CANCELLED';
  } else if (raw.isSEV || raw.line?.name?.includes('SEV')) {
    status = 'SEV';
  } else if (delayInMinutes > 5) {
    status = 'DELAYED';
  }

  return {
    tripId: raw.tripId || 'unknown',
    stationId: raw.stationId || raw.stop?.id || 'unknown',
    stationName: raw.stationName || raw.stop?.name || 'Unknown Station',
    plannedTime: new Date(plannedTime).toISOString(),
    actualTime: actualTime ? new Date(actualTime).toISOString() : undefined,
    delayInMinutes,
    status,
    platform: raw.plannedPlatform || raw.platform || raw.actualPlatform || '',
    lineName: raw.lineName || raw.line?.name || '',
    operatorName: raw.line?.operator?.name || raw.operatorName || 'eurobahn',
    direction: raw.direction || ''
  };
}

import { EurobahnDeparture, EurobahnDisruption } from '../domain/types/index';

/**
 * Normalizes a raw departure object into the strict EurobahnDeparture schema.
 */
export function normalizeDeparture(raw: any): EurobahnDeparture {
  const plannedTime = raw.plannedTime || raw.plannedWhen || raw.when;
  const actualTime = raw.actualTime || raw.when || raw.plannedWhen;
  const delayInMinutes = raw.delayInMinutes ?? (raw.delay != null ? Math.round(raw.delay / 60) : 0);
  
  let status: EurobahnDeparture['status'] = 'HEALTHY';
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
    plannedTime: new Date(plannedTime).toISOString(),
    actualTime: actualTime ? new Date(actualTime).toISOString() : undefined,
    delayInMinutes,
    status,
    plannedPlatform: raw.plannedPlatform || raw.platform || '',
    actualPlatform: raw.actualPlatform || raw.platform,
    lineName: raw.lineName || raw.line?.name || '',
    direction: raw.direction || ''
  };
}

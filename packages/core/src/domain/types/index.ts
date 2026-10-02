export interface TransitDeparture {
  tripId: string;
  stationId: string;
  stationName: string;
  lineName: string;
  operatorName: string;
  plannedTime: string;
  actualTime?: string;
  delayInMinutes: number;
  platform: string;
  direction: string;
  status: 'HEALTHY' | 'DELAYED' | 'CANCELLED' | 'SEV';
}

export interface TransitDisruption {
  id: string;
  affectedLine: string;
  type: string;
  title: string;
  description: string;
  isEurobahnSpecific: boolean;
  status: 'ACTIVE' | 'RESOLVED';
}

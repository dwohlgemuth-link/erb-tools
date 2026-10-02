export interface EurobahnTrip {
  id: string;
  lineName: string;
  direction: string;
}

export interface EurobahnDeparture {
  tripId: string;
  stationId: string;
  plannedTime: string; // ISO string
  actualTime?: string; // ISO string
  delayInMinutes: number;
  status: 'HEALTHY' | 'DELAYED' | 'CANCELLED' | 'SEV';
  plannedPlatform: string;
  actualPlatform?: string;
  lineName: string;
  direction: string;
}

export interface EurobahnDisruption {
  id: string;
  title: string;
  description: string;
  affectedLines: string[];
  status: 'ACTIVE' | 'RESOLVED';
}

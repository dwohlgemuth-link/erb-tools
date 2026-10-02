export interface EurobahnTrip {
  id: string;
  line: string;
  direction: string;
}

export interface EurobahnDeparture {
  tripId: string;
  stationId: string;
  plannedTime: Date;
  actualTime?: Date;
  delayMinutes: number;
  platform: string;
  line: string;
  direction: string;
}

export interface EurobahnDisruption {
  id: string;
  title: string;
  description: string;
  affectedLines: string[];
}

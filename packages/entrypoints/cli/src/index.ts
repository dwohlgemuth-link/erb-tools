#!/usr/bin/env node
import { Command } from 'commander';
import { DBHafasAdapter } from '@erb-tools/hafas-client';

const program = new Command();
const transitPort = new DBHafasAdapter('erb-tools-cli');

program
  .name('erb-tools')
  .description('CLI to some eurobahn transit data utilities')
  .version('1.0.0');

program.command('departures')
  .description('Get live departures for a station')
  .argument('<stationId>', 'Station ID')
  .action(async (stationId) => {
    try {
      const departures = await transitPort.getLiveDepartures(stationId);
      console.table(departures, ['plannedTime', 'delayMinutes', 'platform', 'line', 'direction']);
    } catch (error: any) {
      console.error('Error fetching departures:', error.message);
    }
  });

program.parse();

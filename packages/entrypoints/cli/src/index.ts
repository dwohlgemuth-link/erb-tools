#!/usr/bin/env node
import { Command } from 'commander';
import { DBHafasAdapter } from '@erb-tools/hafas-client';

const program = new Command();
const transitPort = new DBHafasAdapter('erb-tools-cli');

program
  .name('erb-tools')
  .description('CLI to fetch eurobahn transit data')
  .version('1.0.0');

program.command('departures')
  .description('Get live departures for a station')
  .argument('<stationId>', 'Station ID')
  .option('-l, --limit <number>', 'Number of results', '10')
  .action(async (stationId, options) => {
    try {
      const limit = parseInt(options.limit, 10);
      const departures = await transitPort.getLiveDepartures(stationId, limit);
      console.table(departures, ['plannedTime', 'delayInMinutes', 'status', 'plannedPlatform', 'lineName', 'direction']);
    } catch (error: any) {
      console.error('Error fetching departures:', error.message);
    }
  });

program.parse();

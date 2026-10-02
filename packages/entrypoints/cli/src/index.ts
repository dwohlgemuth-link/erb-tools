#!/usr/bin/env node
import { Command } from 'commander';
import { DBVendoAdapter } from '@erb-tools/db-vendo';
import { EurobahnScraper } from '@erb-tools/web-scraper';

const program = new Command();
const transitPort = new DBVendoAdapter('erb-tools-cli');
const scraper = new EurobahnScraper();

program
  .name('erb-tools')
  .description('Generalized open-source CLI toolkit optimized for tracking eurobahn (ERB) transit operations')
  .version('1.0.0');

program.command('departures')
  .description('Get live departures for a station')
  .argument('<stationId>', 'Station ID')
  .option('-l, --limit <number>', 'Number of results', '10')
  .option('-o, --operator <string>', 'Operator name to filter by', 'eurobahn')
  .action(async (stationId, options) => {
    try {
      const limit = parseInt(options.limit, 10);
      const operator = options.operator;
      const departures = await transitPort.getLiveDepartures(stationId, operator, limit);
      console.table(departures, ['plannedTime', 'delayInMinutes', 'status', 'platform', 'lineName', 'operatorName', 'direction']);
    } catch (error: any) {
      console.error('Error fetching departures:', error.message);
    }
  });

program.command('disruptions')
  .description('Get active disruptions')
  .option('-o, --operator <string>', 'Operator name to filter by', 'eurobahn')
  .action(async (options) => {
    try {
      const operator = options.operator;
      const disruptions = await scraper.getDisruptions(operator);
      console.table(disruptions, ['type', 'affectedLine', 'title', 'status']);
    } catch (error: any) {
      console.error('Error fetching disruptions:', error.message);
    }
  });

program.parse();

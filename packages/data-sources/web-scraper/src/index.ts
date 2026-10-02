import axios from 'axios';
import * as cheerio from 'cheerio';
import { EurobahnDisruption } from '@erb-tools/core';

export class EurobahnScraper {
  private baseUrl = 'https://www.eurobahn.de';

  async getTrafficUpdates(): Promise<EurobahnDisruption[]> {
    try {
      const { data } = await axios.get(`${this.baseUrl}/en/traffic-updates/`);
      const $ = cheerio.load(data);
      const disruptions: EurobahnDisruption[] = [];

      // Stub for scraping logic
      $('.traffic-update-item').each((i, el) => {
        disruptions.push({
          id: `disruption-${i}`,
          title: $(el).find('h3').text().trim(),
          description: $(el).find('.description').text().trim(),
          affectedLines: []
        });
      });

      return disruptions;
    } catch (error) {
      console.error('Error scraping eurobahn updates:', error);
      return [];
    }
  }
}

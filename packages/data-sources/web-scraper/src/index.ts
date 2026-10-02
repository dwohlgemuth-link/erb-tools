import axios from 'axios';
import * as cheerio from 'cheerio';
import { TransitDisruption } from '@erb-tools/core';

export class EurobahnScraper {
  private baseUrl = 'https://www.eurobahn.de';

  async getDisruptions(operator = 'eurobahn'): Promise<TransitDisruption[]> {
    if (operator.toLowerCase() !== 'eurobahn') {
      return []; // This specific scraper is natively eurobahn-only
    }
    
    try {
      const { data } = await axios.get(`${this.baseUrl}/en/traffic-updates/`);
      const $ = cheerio.load(data);
      const disruptions: TransitDisruption[] = [];

      $('.traffic-update-item').each((i, el) => {
        disruptions.push({
          id: `disruption-${i}`,
          affectedLine: $(el).find('.line').text().trim() || 'Unknown',
          type: 'TRAFFIC_UPDATE',
          title: $(el).find('h3').text().trim(),
          description: $(el).find('.description').text().trim(),
          isEurobahnSpecific: true,
          status: 'ACTIVE'
        });
      });

      return disruptions;
    } catch (error) {
      console.error('Error scraping eurobahn updates:', error);
      return [];
    }
  }
}

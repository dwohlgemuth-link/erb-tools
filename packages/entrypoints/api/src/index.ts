import express from 'express';
import { DBVendoAdapter } from '@erb-tools/db-vendo';
import { EurobahnScraper } from '@erb-tools/web-scraper';

const app = express();
const port = process.env.PORT || 3000;
const transitPort = new DBVendoAdapter('erb-tools-api');
const scraper = new EurobahnScraper();

app.get('/v1/eurobahn/departures/:stationId', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const operator = (req.query.operator as string) || 'eurobahn';
    const departures = await transitPort.getLiveDepartures(req.params.stationId, operator, limit);
    res.json({ success: true, data: departures });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/v1/eurobahn/disruptions', async (req, res) => {
  try {
    const operator = (req.query.operator as string) || 'eurobahn';
    const disruptions = await scraper.getDisruptions(operator);
    res.json({ success: true, data: disruptions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

import express from 'express';
import { DBHafasAdapter } from '@erb-tools/hafas-client';

const app = express();
const port = process.env.PORT || 3000;
const transitPort = new DBHafasAdapter('erb-tools-api');

app.get('/v1/departures/:stationId', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const departures = await transitPort.getLiveDepartures(req.params.stationId, limit);
    res.json({ success: true, data: departures });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

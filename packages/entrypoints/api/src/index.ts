import express from 'express';
import { DBHafasAdapter } from '@erb-tools/hafas-client';

const app = express();
const port = process.env.PORT || 3000;
const transitPort = new DBHafasAdapter('erb-tools-api');

app.get('/v1/departures/:stationId', async (req, res) => {
  try {
    const departures = await transitPort.getLiveDepartures(req.params.stationId);
    res.json(departures);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

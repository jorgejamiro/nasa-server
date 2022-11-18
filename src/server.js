import http from 'http';

import app from './app.js';
import { loadPlanetsData } from './models/planets.model.js';
import { loadLaunchesData } from './models/launches.model.js';

import pkg from './services/mongo.cjs';
const { mongoConnect } = pkg;

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    });
}

startServer();



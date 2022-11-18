import express from 'express';

import planetsRouter  from '../routes/planets/planets.router.js'
import launchesRouter from '../routes/launches/launches.router.js';

const api = express.Router();

api.use('/launches', launchesRouter);
api.use('/planets', planetsRouter);

export default api;
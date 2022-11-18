import { parse } from 'csv-parse';
import fs from 'fs';

import planets from './planets.mongo.js';


function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

export const loadPlanetsData = async () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(new URL('../../data/kepler_data.csv', import.meta.url))
        .pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                savePlanet(data);
            }
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`${countPlanetsFound} habitable planets found!`);
            resolve();
        });
    });
}

async function getAllPlanets() {
    return await planets.find({}, {
        '_id': 0, '__v': 0,  // in order to exclude these fields
    });
} 

async function savePlanet(data) {
    try {
        // this block represents an 'UPSERT' operation which means that the second object only will be 
        // inserted if the first one didn't exist in the database previously
        await planets.updateOne({
            keplerName: data.kepler_name,
        }, {
            keplerName: data.kepler_name,
        }, {
            upsert: true,
        });
    } catch (error) {
        console.error(`Could not save planet ${error}`);
    }
}

export default getAllPlanets;

import axios from 'axios';

import launches from './launches.mongo.js';
import planets from './planets.mongo.js';


const DEFAULT_FLIGHT_NUMBER = 100;

async function populateLaunches() {
    const response = await axios.post(`https://api.spacexdata.com/v4/launches/query`, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        } 
    });

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };

        console.log(`${launch.flightNumber} ${launch.mission}`);
    
        await saveLaunch(launch);
    }
}

export const existsLaunchWithId = async (launchId) => {
    return await findLaunch({
        flightNumber: launchId,
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber'); // '-' descending order
    
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

function getAllLaunches() {
    return launches.find({}, {
        '_id': 0, '__v': 0
    });
}

export const loadLaunchesData = async () => {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (firstLaunch) {
        console.log('Launch data already loaded!');
    } else {
        await populateLaunches();
    }
}

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function saveLaunch(launch) {
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

export const scheduleNewLaunch = async (launch) => {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (!planet) {
        throw new Error('No matching planet found');
    }
    
    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

export const abortLaunchWithId = async (launchId) => {
    const launchAborted = await launches.updateOne({
        flightNumber: launchId,  
    }, {
        upcoming: false,
        success: false,
    });

    // this tells us that the document was successfully aborted
    return launchAborted.modifiedCount === 1;
}

export default getAllLaunches;


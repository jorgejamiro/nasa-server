import getAllLaunches, { abortLaunchWithId, existsLaunchWithId, scheduleNewLaunch } from '../../models/launches.model.js';

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

export const httpAddNewLaunch = async (req, res) => {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    // Another way would be isNaN(launch.launchDate)
    if (launch.launchDate.toString() === 'Invalid Date') {
        return res.status(400).json({
           error: 'Invalid launch date', 
        });
    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

export const httpAbortLaunch = async (req, res) => {
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);
    
    if (!existsLaunch) {
        return res.status(400).json({
            error: 'Launch not found',
        });
    }

    const launchAborted = await abortLaunchWithId(launchId);
    if (!launchAborted) {
        return res.status(400).json({
            error: 'Unsuccesful launch abortion',
        });
    }

    return res.status(200).json({
        ok: true,
    });
}

export default httpGetAllLaunches;


import mongoose from 'mongoose';

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    target: {
        type: String,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
});

// Connecting launchesSchema with the "launches" collection
const launches = mongoose.model('Launch', launchesSchema);
export default launches;
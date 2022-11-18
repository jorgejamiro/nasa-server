import mongoose from 'mongoose';

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    },
});

// Connects planetSchema with the "planets" collection
const planets = mongoose.model('Planet', planetSchema);
export default planets;
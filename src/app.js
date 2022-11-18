import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import api from './routes/api.js';


const app = express();

//app.use(cors({
//    origin: 'https://nasa-server-ztm.herokuapp.com/',
//}));

app.use(cors());

app.use(morgan('combined'));
app.use(express.json());

app.use('/v1/', api);

app.get('/', (req, res) => {
    res.send('APP IS RUNNING.');
});

export default app;
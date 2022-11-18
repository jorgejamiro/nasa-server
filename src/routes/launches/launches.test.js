const request = require('supertest');
const baseUrl = 'http://localhost:8000';
//const app = require('../../app.js');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo.cjs');

describe ('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect();
    });
    
    describe ('Test /GET launches', () => {
        test('it should respond with code 200 - Success', async () => {
            const response = await request(baseUrl)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        })
    });
    
    describe ('Test /POST launches', () => {
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-296 A f',
            launchDate: 'January 4, 2028',
        };
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-296 A f', 
        };
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-296 A f',
            launchDate: 'jarrrrr',
        };
    
        test('it should respond with 201 - Created', async () => {
            const response = await request(baseUrl)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
            
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });
    
        test('it should catch mission requires properties', async () => {
            const response = await request(baseUrl)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
        });
    
        test('it should catch invalid dates', async () => {
            const response = await request(baseUrl)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
        
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    })
});


//router.test.js

var request = require('supertest');
var server = require('../index.js');

beforeAll(async () => {
    // do something before anything else runs
    console.log('jest starting!');
});

// close the server after each test run
afterAll(() => {
    server.close();
    console.log('server closed!');
});

describe('basic route tests', () => {
    test('not allow GET /', async () => {
        const response = await request(server).get('/');
        expect(response.status).toEqual(405);
    });
});

describe('controller tests', () => {
    test('successful case (should return records)', async () => {
        const record = await request(server)
            .post('/api/search')
            .send({
                'startDate': '2016-01-01',
                'endDate': '2019-01-01',
                'minCount': '0',
                'maxCount': '500'
            });
        expect(record.body.code).toEqual(0);
        expect(record.body.msg).toBe('success');
        expect(record.statusCode).toBe(200);
    });

    test('invalid request case', async () => {
        const record = await request(server)
            .post('/api/search')
            .send({
                'startDate': '01-01-2020',
                'endDate': '01-01-2015',
                'minCount': '1000',
                'maxCount': '-500'
            });
        expect(record.body.code).toEqual(2);
        expect(record.body.msg).toBe('bad request');
        expect(record.statusCode).toBe(400);
    });
});
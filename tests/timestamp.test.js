const expect = require('expect');
const request = require('supertest');
const {app} = require('../index')

describe('GET /api/timestamp/:datestring', () => {
    it('Should return unix and utc times of right now if date not specified', (done) => {
        request(app)
            .get('/api/timestamp')
            .expect(200)
            .expect((res) => {
                expect(typeof res.body.utc).toBe('string')
                expect(typeof res.body.unix).toBe('number')
            })
            .end(done)
    })
    it('Should return unix and utc times if date is specified', (done) => {
        let date = new Date();
        request(app)
            .get(`/api/timestamp/${date}`)
            .expect(200)
            .expect((res) => {
                expect(typeof res.body.utc).toBe('string')
                expect(res.body.utc).toBe(date.toUTCString() )
                expect(typeof res.body.unix).toBe('number')
                expect(Math.abs(res.body.unix - date.getTime())).toBeLessThan(10000)
                
            })
            .end(done)
    })
    it('Should return 400 with bad date request', (done) => {
        request(app)
            .get(`/api/timestamp/xyz`)
            .expect(400)
            .end(done)
    })
})

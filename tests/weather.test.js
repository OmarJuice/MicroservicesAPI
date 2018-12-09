const expect = require('expect');
const request = require('supertest');
const {app} = require('../index')

describe('GET /api/weather/:location', () => {
    it('Should return the weather for a valid given location', (done) => {
        const loc = "New York"
        request(app)
            .get(`/api/weather/${loc}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.location).toBe(loc)
            })
            .end(done)
    })
    it('Should should return 404 for a location not found', (done) => {
        const loc = "kbivqlifVWBLlbjbewfOL;HODQ"
        request(app)
            .get(`/api/weather/${loc}`)
            .expect(404)
            .end(done)
    })

})
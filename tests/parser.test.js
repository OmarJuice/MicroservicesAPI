const expect = require('expect');
const request = require('supertest');
const {app} = require('../index')

describe('GET /api/whoami', () => {
    
    it('Should return 200, with ipaddress, language, and software of User', (done) => {
        request(app)
            .get(`/api/whoami`)
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('ipaddress', 'language', 'software')
            })
            .end(done)
    })
})
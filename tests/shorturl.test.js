const expect = require('expect');
const request = require('supertest');
const { app } = require('../index')
const URL = require('../models/url')
const mongoose = require('mongoose')

beforeEach(() => {
    URL.remove({}).exec()
        .then((res) => {

        })
        .catch((err) => {

        })
    URL.create({
        original: "https://www.google.com/",
        shortened: 0
    }).then((res) => {

    }).catch((error) => {
        console.log('ERROR: ', error);
    })
})

describe('GET /api/shorturl/:num', () => {
    it('Should redirect to the URL of the given shortURL', (done) => {
        request(app)
            .get('/api/shorturl/0')
            .expect(302)
            .expect('Location', 'https://www.google.com/')
            .end(done)
    })
    it('should return 404 for shortURL that does not exist', (done) => {
        request(app)
            .get('/api/shorturl/100')
            .expect(404)
            .end(done)
    })
    it('should return 400 for invalid shortURL', (done) => {
        request(app)
            .get('/api/shorturl/xyz')
            .expect(400)
            .end(done)
    })
})
describe('POST /api/shorturl', () => {
    let url = 'https://www.google.com/'
    it('Should send JSON of existing URL if given URL already has a shortURL', (done) => {
        request(app)
            .post('/api/shorturl')
            .send({url})
            .expect(200)
            .expect((res) => {
                expect(res.body.original).toBe('https://www.google.com/')
                expect(typeof res.body.shortened).toBe('number')
            })
            .end(done)
    })
    it('Should return 400 for invalid url', (done) => {
        request(app)
            .post('/api/shorturl')
            .send({
                url: 'ytufyiguohipj'
            })
            .expect(400)
            .end(done)
    })
    it('Should return new shortURL incremented from previous if a new url is given', (done) => {
        request(app)
            .post('/api/shorturl')
            .send({
                url: 'https://www.freecodecamp.org/'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.original).toBe('https://www.freecodecamp.org/')
                expect(res.body.shortened).toBe(1)
            })
            .end(done)
    })
})